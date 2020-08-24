
interface args {
  [name: string]: any;
	_: Array<string>;
}

export function parseDefinedArgs(args: args, argsDef?: Array<string>): args {
  if (!argsDef) return args;
  
  const parsedArgs = { ...args };
  argsDef.forEach((arg) => {
    if (parsedArgs.hasOwnProperty(arg)) return;

    parsedArgs[arg] = args._.shift();
  });
  parsedArgs._ = args._
  
  return parsedArgs;
}