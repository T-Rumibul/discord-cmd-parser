import { split } from './functions/split';
import { parseArray } from './functions/parseArray';
import { parseDefinedArgs } from './functions/parseDefinedArgs';
import { toLowerCase } from './utils/toLowerCase';
import Events from 'events';
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

export interface Parser {
	prefix?: string;
	useQuotes?: boolean;
	quotesType?: string;
	namedSeparator?: string;
}
export class Parser extends Events.EventEmitter {
	constructor(options: options = {}) {
		super();
		this.prefix = options.prefix || '!';
		this.useQuotes = options.useQuotes || true;
		this.quotesType = options.quotesType || '"';
		this.namedSeparator = options.namedSeparator || '-';
	}

	/** Parses string to args
	 * @param {string} string - String to parse
	 * @param {Array<string>} argsDef - parser will assing parsed args to keys in order they apear.
	 * @example
	 * console.log(parse('arg1 arg2 arg3', ['key1', 'key2'])); // ----> {_:['arg3'], key1: 'arg1', key2: 'arg2'}
	 */
	public parse(string: string | Array<string>, argsDef?: Array<string>): args {
		const splitedString = split(string, {
			useQuotes: this.useQuotes,
			quotesType: this.quotesType,
		});

		const args = parseDefinedArgs(parseArray(splitedString, this.namedSeparator), argsDef);

		this.emit('parse', args);
		return args;
	}
	/**
	 * Parse command from string based on prefix and returns object with command property and parseArgs method, if command not found command property will be empty string
	 * @param {string} string - string to parase command from
	 */
	public getCommand(
		string: string,
		prefix?: string
	): { command: string; parseArgs: { (argsDef?: Array<string>): args } } {
		const currentPrefix = prefix || this.prefix;

		const splitedString = split(string, { useQuotes: this.useQuotes, quotesType: this.quotesType });

		const command = splitedString.splice(0, 1).join('').split('');
		const result = {
			command: '',
			parseArgs: (argsDef?: Array<string>): args => {
				return {
					command: result.command,
					args: this.parse(splitedString, argsDef),
				};
			},
		};
		if (command.splice(0, currentPrefix.length).join('') === currentPrefix) {
			result.command = toLowerCase(command.join(''));
		}
		this.emit('command', result);
		return result;
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
