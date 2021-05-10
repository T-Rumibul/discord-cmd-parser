interface parseResults extends Record<string, string | string[]> {
    _: string[]
}

export class Parser {
	private useQuotes: boolean;
	private quotesType: string;


    constructor(options: { useQuotes?: boolean| undefined, quotesType?: string| undefined} = {}) {
        this.useQuotes = options.useQuotes || true
        this.quotesType = options.quotesType || '"'
    }

    /** Parses string to args
	 * @param {string} string - String to parse
	 * @param {Array<string>} argsDef - parser will assing parsed args to keys in order they apear.
	 * @example
	 * console.log(parse('arg1 arg2 arg3', ['key1', 'key2'])); // ----> {_:['arg3'], key1: 'arg1', key2: 'arg2'}
	 */
    public parse(string: string, definedArgs: string[] = []){
        string = string.trim().replace(/\s+|\t+/g, ' ');
        const splitedString = this.split(string)
        let parsedArgs: parseResults = {
            _: splitedString
        };
        if(definedArgs.length > 0) {
            definedArgs.forEach((arg: string) => {
                if(parsedArgs[arg] !== undefined) return;
                parsedArgs[arg] = parsedArgs._.shift()
            })
        }
        
        return parsedArgs;
    }
    private split(string: string, splitedString: string[] = []): string[] {
        if(string.length == 0) return splitedString;
        //Trim and replace unwanted tabs multiple spaces etc.
        string = string.trim()
        let arg;
        let endIndex
        for(let i = 0; i < string.length; i++ ) {
    
            // if we found open quote, start another loop to find closing quote;
            if(this.useQuotes && string[i] == this.quotesType) {
                for(let j = i+1; j < string.length; j++) {
                    if(string[j] == this.quotesType) {
                        endIndex = j+1;
                        break; 
                    }
                }
                break;
            }
    
            if(string[i] == ' ') {
                endIndex = i
                break;
            }
        }
        if(endIndex === undefined) endIndex = string.length
        arg = string.slice(0, endIndex)
        if(this.useQuotes && arg.startsWith(this.quotesType) && arg.endsWith(this.quotesType)) arg = arg.slice(1, arg.length - 1)
        else arg = arg.toLowerCase()


        splitedString.push(arg)
        const result = this.split(string.slice(endIndex), splitedString)
        return result
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
export const createParser = (options: { useQuotes?: boolean | undefined, quotesType?: string | undefined} = {}): Parser => {
    return new Parser(options)
}




