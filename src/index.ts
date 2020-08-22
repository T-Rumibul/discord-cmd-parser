import debug from 'debug';
const log = debug('Parser:INFO');
const logDeep = debug('Parser:DEEP_INFO');
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

interface dirtArgs {
	named: args;
	unNamed: Array<string>;
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
	// Split string into args by defined separators
	private _split(dirtString: string): Array<string> {
		// Replace multiple spaces or new lines for correct spliting
		log(`Spliting string: |${dirtString}|`);

		let string = dirtString.trim().replace(/\s\s+/g, ' ');

		log(`Removed extra whitespaces and new lines: |${string}|`);

		const splitedString: Array<string> = [];
		for (let i = 0; i < string.length; i++) {
			logDeep(`-------SPLITTING------- \nITERATION: ${i}\nSTRING: |${string}|`);
			// Check for quotes
			if (this.pOptions.useQuotes && string.startsWith(this.pOptions.quotesType)) {
				logDeep(`------Find Quote------\nITERATION: ${i}\nSTRING: |${string}|`);
				let nextQuote;

				for (let j = 1; j < string.length; j++) {
					if (string[j] === this.pOptions.quotesType) {

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
	private _isSingleWord(string: string) {
		if (string.match(/\s/g) === null) {
			return true
		}
		return false
	}
	// transforms to lower if string is single word
	private _toLowerCase(string: string) {
		if (this._isSingleWord(string)) return string.toLowerCase()
		return string;
	}

	private _clearArgs(dirtArgs: dirtArgs, argsDef?: Array<string>): args {
		let clearArgs: args = { ...dirtArgs.named };

		log(`Clearing args\nArgs definition: ${argsDef}`);

		if (!argsDef) return { ...dirtArgs.named, _: dirtArgs.unNamed };

		argsDef.forEach((arg) => {
			log(`CURRENT ARG ${arg}`);
			if (clearArgs.hasOwnProperty(arg)) return;
			clearArgs[arg] = dirtArgs.unNamed.shift();
		});
		clearArgs._ = dirtArgs.unNamed;
		log(`Args cleared: ${JSON.stringify(clearArgs)}`);
		return clearArgs;
	}
	/** Parses string to args
	 * @param {string} string - String to parse
	 * @param {Array<string>} argsDef - parser will assing parsed args to keys in order they apear.
	 * @example
	 * console.log(parse('arg1 arg2 arg3', ['key1', 'key2'])); // ----> {_:['arg3'], key1: 'arg1', key2: 'arg2'}
	 */
	public parse(string: string, argsDef?: Array<string>): args {
		log(`Got string: |${string}| \nGot args definition: [${argsDef}]`);
		const splitedString = this._split(string);
		const dirtArgs: dirtArgs = {
			named: {},
			unNamed: [],
		};
		log('Parsing splited');
		while (splitedString.length !== 0) {
			logDeep(
				`-----PARSING SPLITED STRING-----\nSTRING: ${JSON.stringify(
					splitedString
				)}\nCURRENT ARG: ${splitedString[0]}`
			);
			if (splitedString[0].startsWith(this.pOptions.namedSeparator)) {
				logDeep(
					`-----FIND NAMED-----\nSTRING: ${JSON.stringify(splitedString)}\nCURRENT ARG: ${
						splitedString[0]
					}`
				);
				dirtArgs.named = {
					...dirtArgs.named,
					...{
						[splitedString
							.shift()
							.split('')
							.slice(this.pOptions.namedSeparator.length)
							.join('')]: this._toLowerCase(splitedString.shift()),
					},
				};

				continue;
			}
			dirtArgs.unNamed.push(this._toLowerCase(splitedString.shift()));
		}

		log(`Splited array is parsed: ${JSON.stringify(dirtArgs)}`);
		const args = this._clearArgs(dirtArgs, argsDef);
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
