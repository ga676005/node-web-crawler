import { JSDOM } from 'jsdom'

export function normalizeURL(input: string) {
  const url = new URL(input)
  let s = url.hostname + url.pathname
  s = s.replace(/\/$/, '') // remove trailing /
  return s
  // const result = input.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
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
        console.log(err.message, e.href)
      }
    }
    else {
      try {
        return new URL(e.href).href
      }
      catch (err) {
        console.log(err.message, e.href)
      }
    }

    return null
  }).filter(Boolean)

  return result
}

export async function crawlPage(currentURL: string) {
  try {
    const response = await fetch(currentURL)
    if (response.ok === false || response.status >= 400) {
      console.error('response.ok', response.ok)
      console.error('response.status', response.status)
    }
    else if (response.headers.get('content-type')?.includes('text/html') !== true) {
      console.error('content-type is not text/html', response.headers.get('content-type'))
    }
    else {
      const text = await response.text()
      console.log(text)
    }
  }
  catch (err) {
    console.error('something went wrong', err)
  }
}
