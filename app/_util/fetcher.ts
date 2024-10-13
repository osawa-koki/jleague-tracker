import keysToCamelCase from "./keysToCamelCase"

export default async function fetcher(url: string) {
  const res = await fetch(url)
  const data = await res.json()
  return keysToCamelCase(data)
}
