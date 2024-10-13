export default function sum(...numbers: number[]): number {
  return numbers.reduce((acc, current) => acc + current, 0)
}
