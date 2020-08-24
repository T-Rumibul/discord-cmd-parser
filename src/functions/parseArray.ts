
import { toLowerCase } from '../utils/toLowerCase'
interface args {
  [name: string]: any;
	_: Array<string>;
}

export function parseArray(array: Array<string>, namedSeparator: string) {
  const args: args = {
    _: [],
  };

  while (array.length !== 0) {
    if (array[0].startsWith(namedSeparator)) {

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


  return args
}