
import { createParser} from './index';


const parser = createParser();

test('test with default args without args definition', () => {
	expect(parser.parse('git remote add origin https://github.com')).toEqual({
		_: ['git', 'remote', 'add', 'origin', 'https://github.com'],
	});
});

test(`test quotes from the start of the string`, () => {
	expect(parser.parse(`"git add remote" and other`)).toEqual({
		_: ['git add remote', 'and', 'other'],
	});
});

test(`test quotes in the end of the string`, () => {
	expect(parser.parse(`"git add remote" and "other dasds"`)).toEqual({
		_: ['git add remote', 'and', 'other dasds'],
	});
});

test(`test args definition`, () => {
	expect(parser.parse(`git remote add and "other dasds"`, ['command', 'arg1', 'arg2'])).toEqual({
		_: ['and', 'other dasds'],
		command: 'git',
		arg1: 'remote',
		arg2: 'add',
	});
});

test(`test for lowerCase`, () => {
	expect(
		parser.parse(`GIT remote testLower "testLower iN Quotes"`, [
			'definedNotInLower',
		])
	).toEqual({
		_: ['remote', 'testlower', 'testLower iN Quotes'],
		definedNotInLower: 'git',
	});
});

test(`empy string test`, () => {
	expect(
		parser.parse(``, [
			'definedNotInLower',
		])
	).toEqual({
		_: [],
		definedNotInLower: undefined,
	});
});
