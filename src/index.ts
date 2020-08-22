import { log, logDeep } from './utils/logger'
import { split } from './functions/split'
import { parseArray } from './functions/parseArray'
import { parseDefinedArgs } from './functions/parseDefinedArgs'
interface options {
	prefix?: string;
	useQuotes?: boolean;
	quotesType?: string;
	namedSeparator?: string;
}
interface args {
	_?: Array<string>;
	[name: string]: any;
}



const deffaultOptions: options = {
	prefix: '',
	useQuotes: true,
	quotesType: '"',
	namedSeparator: '-',
};
export interface Parser {
	pOptions: options;
}
export class Parser {
	constructor(options?: options) {
		this.pOptions = { ...deffaultOptions, ...options };
	}

	/** Parses string to args
	 * @param {string} string - String to parse
	 * @param {Array<string>} argsDef - parser will assing parsed args to keys in order they apear.
	 * @example
	 * console.log(parse('arg1 arg2 arg3', ['key1', 'key2'])); // ----> {_:['arg3'], key1: 'arg1', key2: 'arg2'}
	 */
	public parse(string: string, argsDef?: Array<string>): args {
		log(`Got string: |${string}| \nGot args definition: [${argsDef}]`);
		const splitedString = split(string, {useQuotes: this.pOptions.useQuotes, quotesType: this.pOptions.quotesType});

		const args = parseDefinedArgs(parseArray(splitedString, this.pOptions.namedSeparator), argsDef)
		log(`Parsing complete ${JSON.stringify(args)}`);

		return args;
	}

}

export interface init {
	(options?: options): Parser;
}

/** Initialize parser instance with provided options
 * @param {options} options - String to parse
 * @returns {Parser}
 */
export function init(options?: options): Parser {
	return new Parser(options);
}

export default init;
