import { JSDOM } from 'jsdom'

export function normalizeURL(input) {
  const url = new URL(input)
  let s = url.hostname + url.pathname
  s = s.replace(/\/$/, '') // remove trailing /
  return s
  // const result = input.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
}

export function getURLsFromHTML(htmlBody, baseURL) {
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
