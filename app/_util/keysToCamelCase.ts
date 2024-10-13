function toCamelCase (str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export default function keysToCamelCase (obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => keysToCamelCase(item))
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = toCamelCase(key)
      acc[camelKey] = keysToCamelCase(value)
      return acc
    }, {})
  }
  return obj
}
