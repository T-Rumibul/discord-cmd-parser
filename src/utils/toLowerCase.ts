import {  isSingleWord  } from './isSingleWord'
// transforms to lower if string is single word
export function toLowerCase(string: string) {
  if (isSingleWord(string)) return string.toLowerCase()
  return string;
}