import { log, logDeep } from '../utils/logger'

interface options {
  useQuotes: boolean;
  quotesType: string;
}
/** 
 * Split string into args
*/
export function split(string: string, { useQuotes, quotesType}: options): Array<string> {
  // Replace multiple spaces or new lines for correct spliting
  log(`Spliting string: |${string}|`);

  string = string.trim().replace(/\s\s+/g, ' ');

  log(`Removed extra whitespaces and new lines: |${string}|`);

  const splitedString: Array<string> = [];
  for (let i = 0; i < string.length; i++) {
    logDeep(`-------SPLITTING------- \nITERATION: ${i}\nSTRING: |${string}|`);
    // Check for quotes
    if (useQuotes && string.startsWith(quotesType)) {
      logDeep(`------Find Quote------\nITERATION: ${i}\nSTRING: |${string}|`);
      let nextQuote;

      for (let j = 1; j < string.length; j++) {
        if (string[j] === quotesType) {

          logDeep(
            `Second Quote\nITERATION: ${j}\nSTRING: |${string}|\n-----------------`
          );

          nextQuote = j;
          break;
        }
      }

      if (!nextQuote) {
        logDeep(
          `Second Quote NOT FOUND\nITERATION: ${i}\nSTRING: |${string}|\n-----------------`
        );
        splitedString.push(string.slice(0));
        break;
      }
      splitedString.push(string.slice(1, nextQuote));
      string = string.slice(nextQuote + 2);
      i = 0;
      continue;
    }
    // Check if char is whitespace
    if (string[i].match(/\s/)) {
      logDeep(
        `Found whitespace\nITERATION: ${i}\nSTRING: |${string}|\n-----------------`
      );
      splitedString.push(string.slice(0, i));
      string = string.slice(i + 1);
      i = 0;
    } else if (i === string.length - 1) {
      logDeep(`STRING END\nITERATION: ${i}\nSTRING: |${string}|\n-----------------`);
      splitedString.push(string.slice(0));
    }
  }
  log(`String is splited: ${JSON.stringify(splitedString)}`);
  return splitedString;
}