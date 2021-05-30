export interface IargsDefinition {
	[key: string]: {
		default: string
	}
}


type ParsedDefs<T> = {
	[K in keyof T]: string;
};
type ParsedUndefined = { _: string[] }





export class Parser {
	private useQuotes: boolean;
	private quotesType: string;

	constructor(options: { useQuotes?: boolean | undefined; quotesType?: string | undefined } = {}) {
		this.useQuotes = options.useQuotes || true;
		this.quotesType = options.quotesType || '"';
	}

	/** Parses string to args
	 * @param {string} string - String to parse
	 */
	public parse(string: string) {
		string = string.trim().replace(/\s+|\t+/g, ' ');
		let parsedMessage: string[] = this.split(string);
		return parsedMessage;
	}
	/** Parses a string split into arguments, and assigns them to the declared arguments in order they apear
	 * 
	 *
	 */
	public parseCommandArgs<T extends IargsDefinition>(parsedMessage: string[],  argsDefs: T): ParsedDefs<typeof argsDefs> & ParsedUndefined;
	public parseCommandArgs(parsedMessage: string[], argsDefs: undefined): ParsedUndefined;
	public parseCommandArgs(parsedMessage: any,  argsDefs: any): any  {
		const parsedUndefined: ParsedUndefined = {
			_: [],
		};
		if(typeof argsDefs === "undefined") {
			return parsedUndefined._ = parsedMessage;
		}
		
		if(typeof argsDefs === "object") {
			let parsedDefs: ParsedDefs<typeof argsDefs> = Object.create({})
			for(let key in argsDefs) {
				let value = parsedMessage.shift()
				parsedDefs[key] = (typeof value === 'undefined') ? argsDefs[key].default : value
			}

		
		if (parsedMessage.length > 0) parsedUndefined._ = parsedMessage;
		return Object.assign(parsedDefs, parsedUndefined);
		}
		
	}
	private split(string: string, splitedString: string[] = []): string[] {
		if (string.length == 0) return splitedString;
		//Trim and replace unwanted tabs multiple spaces etc.
		string = string.trim();
		let arg;
		let endIndex;
		for (let i = 0; i < string.length; i++) {
			// if we found open quote, start another loop to find closing quote;
			if (this.useQuotes && string[i] == this.quotesType) {
				for (let j = i + 1; j < string.length; j++) {
					if (string[j] == this.quotesType) {
						endIndex = j + 1;
						break;
					}
				}
				break;
			}

			if (string[i] == ' ') {
				endIndex = i;
				break;
			}
		}
		if (endIndex === undefined) endIndex = string.length;
		arg = string.slice(0, endIndex);
		if (this.useQuotes && arg.startsWith(this.quotesType) && arg.endsWith(this.quotesType))
			arg = arg.slice(1, arg.length - 1);
		else arg = arg.toLowerCase();

		splitedString.push(arg);
		const result = this.split(string.slice(endIndex), splitedString);
		return result;
	}
	public disableQuotes() {
		this.useQuotes = false;
	}
	public enableQuotes() {
		this.useQuotes = true;
	}
	public changeQuotesType(value: string) {
		this.quotesType = value;
	}
}
export const createParser = (
	options: { useQuotes?: boolean | undefined; quotesType?: string | undefined } = {}
): Parser => {
	return new Parser(options);
};
