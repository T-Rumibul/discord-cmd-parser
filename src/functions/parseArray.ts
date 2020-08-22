import { log, logDeep } from '../utils/logger'
import { toLowerCase } from '../utils/toLowerCase'
interface args {
  [name: string]: any;
	_: Array<string>;
}

export function parseArray(array: Array<string>, namedSeparator: string) {
  const args: args = {
    _: [],
  };
  log('Parsing splited');
  while (array.length !== 0) {
    logDeep(
      `-----PARSING SPLITED STRING-----\nSTRING: ${JSON.stringify(
        array
      )}\nCURRENT ARG: ${array[0]}`
    );
    if (array[0].startsWith(namedSeparator)) {
      logDeep(
        `-----FIND NAMED-----\nSTRING: ${JSON.stringify(array)}\nCURRENT ARG: ${
          array[0]
        }`
      );
      const argName = array.shift().split('').slice(namedSeparator.length).join('')
      if (argName === '_') {
        array.shift()
        continue
      }
      args[argName] = toLowerCase(array.shift()) // tranform to lower if single word
      

      continue;
    };
    // tranform to lower if single word
    args._.push(toLowerCase(array.shift()));
  }

  log(`Splited array is parsed: ${JSON.stringify(args)}`);
  return args
}