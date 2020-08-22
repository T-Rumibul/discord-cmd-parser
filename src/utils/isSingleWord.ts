export function isSingleWord(string: string) {
  if (string.match(/\s/g) === null) {
    return true
  }
  return false
}