import debug from 'debug';
const log = debug('Parser:INFO');
const logDeep = debug('Parser:DEEP_INFO');
interface options {
	prefix?: string;
	includeCmd: boolean;
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
	includeCmd: false,
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
		let string = dirtString.replace(/\s\s+/g, ' ');
		log(`Removed whitespaces and new lines: |${string}|`);
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

	private _clearArgs(dirtArgs: dirtArgs, argsDef?: Array<string>): args {
		let clearArgs: args = { ...dirtArgs.named };
		log(`Clearing args\nArgs definition: ${argsDef}`);
		if (!argsDef) return { ...dirtArgs.named, _: dirtArgs.unNamed };
		argsDef.forEach((arg) => {
			clearArgs[arg] = dirtArgs.unNamed.shift();
		});
		clearArgs._ = dirtArgs.unNamed;
		log(`Args cleared: ${JSON.stringify(clearArgs)}`);
		return clearArgs;
	}

	public async parse(string: string, argsDef?: Array<string>): Promise<args> {
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
							.join('')]: splitedString.shift(),
					},
				};

				continue;
			}
			dirtArgs.unNamed.push(splitedString.shift());
		}
		log(`Splited array is parsed: ${JSON.stringify(dirtArgs)}`);
		const args = this._clearArgs(dirtArgs, argsDef);
		log(`Parsing complete ${JSON.stringify(args)}`);
		return args;
	}
}

export default Parser;
