import keysToCamelCase from './keysToCamelCase'

export default async function fetcher<T> (url: string): Promise<T> {
  const res = await fetch(url)
  const data = await res.json()
  return keysToCamelCase(data) as T
}
