import type { Pages } from './crawl'

export function printReport(pages: Pages) {
  console.log(`
  ################################ 
            REPORT START
  ################################
  `)

  const list = Object.entries(pages)
    .map(([key, value]) => ({ url: key, count: value }))
  list.sort((a, b) => b.count - a.count)

  list.forEach((e) => {
    console.log(`Found ${(e.count).toString().padStart(2, ' ')} internal links to ${e.url}`)
  })

  console.log(`
  ################################ 
            REPORT END
  ################################
  `)
}
