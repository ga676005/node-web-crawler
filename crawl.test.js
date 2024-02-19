import { expect, it } from 'vitest'
import { getURLsFromHTML, normalizeURL } from './crawl'

it('normalizeURL protocol', () => {
  const input = `https://blog.boot.dev/path`
  const actual = normalizeURL(input)
  const expected = `blog.boot.dev/path`
  expect(actual).toEqual(expected)
})

it('normalizeURL slash', () => {
  const input = `https://blog.boot.dev/path/`
  const actual = normalizeURL(input)
  const expected = `blog.boot.dev/path`
  expect(actual).toEqual(expected)
})

it('normalizeURL capitals', () => {
  const input = 'https://BLOG.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

it('normalizeURL http', () => {
  const input = 'http://BLOG.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

it('getURLsFromHTML absolute', () => {
  const inputURL = 'https://blog.boot.dev'
  const inputBody = '<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>'
  const actual = getURLsFromHTML(inputBody, inputURL)
  const expected = ['https://blog.boot.dev/']
  expect(actual).toEqual(expected)
})

it('getURLsFromHTML relative', () => {
  const inputURL = 'https://blog.boot.dev'
  const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>'
  const actual = getURLsFromHTML(inputBody, inputURL)
  const expected = ['https://blog.boot.dev/path/one']
  expect(actual).toEqual(expected)
})

it('getURLsFromHTML both', () => {
  const inputURL = 'https://blog.boot.dev'
  const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
  const actual = getURLsFromHTML(inputBody, inputURL)
  const expected = ['https://blog.boot.dev/path/one', 'https://other.com/path/one']
  expect(actual).toEqual(expected)
})

it('getURLsFromHTML handle error', () => {
  const inputURL = 'https://blog.boot.dev'
  const inputBody = '<html><body><a href="path/one"><span>Boot.dev></span></a></body></html>'
  const actual = getURLsFromHTML(inputBody, inputURL)
  const expected = []
  expect(actual).toEqual(expected)
})
