import process from 'node:process'
import { crawlPage } from './crawl'

async function main() {
  // Get the CLI input arguments
  const args = process.argv

  // The first two elements of process.argv are always 'node' and the path to the script file
  // So the actual arguments start from index 2
  const userInput = args.slice(2)
  console.log('userInput', userInput)

  if (userInput.length !== 1) {
    // https://wagslane.dev
    console.error('require BASE_URL and only BASE_URL')
    return
  }

  const baseUrl = new URL(userInput[0]).host
  // console.log('crawling', userInput[0])
  const pages = await crawlPage(userInput[0], userInput[0])
  console.log('====', pages, '====')
}

main()
// npx tsx main.ts https://wagslane.dev

// fetch('https://wagslane.dev').then(r => r.text()).then(console.log)
