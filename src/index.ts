import debug from 'debug';
const log = debug('discord-cmd-parser');

interface options {
	prefix?: string;
	includeCmd: boolean;
	useQuotes?: boolean;
	quotesType?: string;
	namedSeparator?: string;
	commonSeparator?: string;
}
interface argsObj {
	[key: string]: any;
}
interface argsDef {
	name: string;
	position?: number;
}

let pOptions: options = {
	prefix: '',
	includeCmd: false,
	useQuotes: true,
	quotesType: '"',
	namedSeparator: '-',
	commonSeparator: ' ',
};

function parseArg(
	charArr: Array<string>,
	indexFrom: number,
	options: options,
	result: Array<string> = []
): argsObj {
	if (
		charArr[indexFrom] === options.namedSeparator ||
		charArr[indexFrom] === options.commonSeparator ||
		indexFrom >= charArr.length
	) {
		return {
			index: indexFrom,
			arg: result.join(''),
		};
	}
	result.push(charArr[indexFrom]);
	return parseArg(charArr, indexFrom + 1, options, result);
}

function customSplit(string: string): Array<string> {
	const splitedString: Array<string> = [];
	string = string + pOptions.commonSeparator;
	for (let i = 0; i < string.length; i++) {
		if (string[i] === pOptions.commonSeparator) {
			if (pOptions.useQuotes && string[0] === pOptions.quotesType) {
				let nextQuote;

				for (let j = 1; j < string.length; j++) {
					if (string[j] === pOptions.quotesType) {
						nextQuote = j;
						break;
					}
				}

				if (!nextQuote) {
					splitedString.push(string.slice(0));
					break;
				}

				splitedString.push(string.slice(1, nextQuote));
				string = string.slice(nextQuote + 2);
				i = 0;
				continue;
			}

			splitedString.push(string.slice(0, i));

			string = string.slice(i + 1);

			i = 0;
		}
	}
	log(splitedString);
	return splitedString;
}

function getNamedName(charArr: Array<string>, name?: string) {
	if (charArr.length <= 0) return name;
}
function parseNamed(charArr: Array<string>) {
	const name: Array<string> = [],
		value: Array<string> = [];

	charArr.splice(0, pOptions.namedSeparator.length);
	while (charArr[0] !== pOptions.commonSeparator && charArr.length > 0) {
		name.push(charArr.shift());
	}
	charArr.forEach((char, index) => {
		name.push(charArr.shift());
	});
	charArr.shift();
	while (charArr[0] !== pOptions.commonSeparator && charArr.length > 0) {
		value.push(charArr.shift());
	}
	charArr.shift();
	return {
		name: name.join(''),
		value: value.join(''),
	};
}

function parseUnNamed(charArr: Array<string>, to = 0) {
	const value: Array<string> = [];
	if (charArr[0] === pOptions.commonSeparator) charArr.splice(0, pOptions.commonSeparator.length);

	while (charArr[0] !== pOptions.commonSeparator && charArr.length > 0) {
		value.push(charArr.shift());
	}
	charArr.shift();
	return value.join('');
}

function nParse(charArr: Array<string>, args: argsObj): argsObj {
	if (charArr.length === 0) return args;
	const char = charArr[0];
	if (char === pOptions.namedSeparator) {
		args.named.push(parseNamed(charArr));
		return nParse(charArr, args);
	} else {
		args.unNamed.push(parseUnNamed(charArr));
		return nParse(charArr, args);
	}
}

export function parser(string: string, argsDef?: Array<argsDef>, options?: options) {
	log('parsing start');
	pOptions = { ...pOptions, ...options };
	const charArr = string.split('');
	customSplit(string);
	const args: argsObj = {
		named: [],
		unNamed: [],
	};
	nParse(charArr, args);

	log('parsing complete');
	log(args);
	// if (pOptions.includeCmd) {
	// 	const getCmdResult = getCmd(parseCharArr, pOptions.prefix);
	// 	result.cmd = getCmdResult.cmd;
	// 	parseCharArr = getCmdResult.charArr;
	// }
}
export default parser;

parser('"dddd dsadsa" get -t "dsadawes dsaewsdwa ddd" named "remote add https://dddd.dd" dddadsd');
