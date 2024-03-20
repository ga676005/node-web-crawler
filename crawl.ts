import { JSDOM } from 'jsdom'

export type Pages = Record<string, number>

export function normalizeURL(input: string) {
  const url = new URL(input)
  let s = url.host + url.pathname
  s = s.replace(/\/$/, '') // remove trailing /
  return s
}

export function getURLsFromHTML(htmlBody: string, baseURL: string) {
  const dom = new JSDOM(htmlBody)
  const a = dom.window.document.querySelectorAll('a')
  const result = [...a].map((e) => {
    if (e.href.startsWith('/')) {
      try {
        return new URL(e.href, baseURL).href
      }
      catch (err) {
        if (err instanceof Error)
          console.log(err.message, e.href)
      }
    }
    else {
      try {
        return new URL(e.href).href
      }
      catch (err) {
        if (err instanceof Error)
          console.log(err.message, e.href)
      }
    }

    return null
  }).filter((v): v is string => Boolean(v))

  return result
}

export async function crawlPage(baseURL: string, currentURL: string, pages: Pages = {}) {
  try {
    if (new URL(currentURL).origin !== baseURL)
      return pages

    // const protocol = new URL(baseURL).protocol
    currentURL = normalizeURL(currentURL)

    if (currentURL in pages) {
      pages[currentURL] += 1
      return pages
    }
    else {
      pages[currentURL] = 1
    }

    console.log(`fetch https://${currentURL}`)
    const response = await fetch(`https://${currentURL}`)
    if (response.ok === false || response.status >= 400) {
      console.error('response.ok', response.ok)
      console.error('response.status', response.status)
    }
    else if (response.headers.get('content-type')?.includes('text/html') !== true) {
      console.error(`${currentURL} content-type is not text/html`, response.headers.get('content-type'))
    }
    else {
      const pageHTML = await response.text()
      // console.log(pageHTML)
      const urls = getURLsFromHTML(pageHTML, baseURL)
      if (urls)
        await Promise.allSettled(urls.map(url => crawlPage(baseURL, url, pages)))
    }

    return pages
  }
  catch (err) {
    console.error('something went wrong', err)
    return pages
  }
}
