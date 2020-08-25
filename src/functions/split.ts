interface options {
	useQuotes: boolean;
	quotesType?: string;
}
/**
 * Split string into args
 */
export function split(string: string | Array<string>, options: options): Array<string> {
	// For the cases whe already parsed array is passed as argument
	if (Array.isArray(string)) return string;

	const { useQuotes, quotesType } = options;
	// Replace multiple spaces or new lines for correct spliting

	string = string.trim().replace(/\s\s+/g, ' ');

	const splitedString: Array<string> = [];
	for (let i = 0; i < string.length; i++) {
		// Check for quotes
		if (useQuotes && string.startsWith(quotesType)) {
			let nextQuote;

			for (let j = 1; j < string.length; j++) {
				if (string[j] === quotesType) {
					nextQuote = j;
					break;
				}
			}
			// quote not found, slice all string and break
			if (!nextQuote) {
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
			splitedString.push(string.slice(0, i));
			string = string.slice(i + 1);
			i = 0;
			// if end of the string
		} else if (i === string.length - 1) {
			splitedString.push(string.slice(0));
		}
	}
	return splitedString;
}
