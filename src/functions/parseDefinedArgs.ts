import { log, logDeep } from '../utils/logger'
interface args {
  [name: string]: any;
	_: Array<string>;
}

export function parseDefinedArgs(args: args, argsDef?: Array<string>): args {
  const parsedArgs = { ...args };

  log(`Parsing defined args \nArgs definition: ${argsDef}`);

  if (!argsDef) return args;

  argsDef.forEach((arg) => {
    log(`CURRENT ARG ${arg}`);
    if (parsedArgs.hasOwnProperty(arg)) return;
    log(args._)
    parsedArgs[arg] = args._.shift();
  });
  parsedArgs._ = args._
  log(`Parsing defined args completed: ${JSON.stringify(parsedArgs)}`);
  return parsedArgs;
}