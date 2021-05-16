import { createParser } from './index';

const parser = createParser();

test('test with default args without args definition', () => {
	expect(parser.parse('git remote add origin https://github.com')).toEqual([
		'git',
		'remote',
		'add',
		'origin',
		'https://github.com',
	]);
});

test(`test quotes from the start of the string`, () => {
	expect(parser.parse(`"git add remote" and other`)).toEqual(['git add remote', 'and', 'other']);
});

test(`test quotes in the end of the string`, () => {
	expect(parser.parse(`"git add remote" and "other dasds"`)).toEqual([
		'git add remote',
		'and',
		'other dasds',
	]);
});

test(`test args definition`, () => {
	expect(
		parser.parseCommandArgs(
			[{ name: 'command' }, { name: 'arg1' }, { name: 'arg2' }],
			parser.parse(`git remote add and "other dasds"`)
		)
	).toEqual({
		_: ['and', 'other dasds'],
		command: 'git',
		arg1: 'remote',
		arg2: 'add',
	});
});

test(`test args definition default value`, () => {
	expect(
		parser.parseCommandArgs(
			[{ name: 'command' }, { name: 'arg1' }, { name: 'arg2', default: 'odd' }],
			parser.parse(`git remote add and "other dasds"`)
		)
	).toEqual({
		_: ['and', 'other dasds'],
		command: 'git',
		arg1: 'remote',
		arg2: 'add',
	});
});

test(`test args definition default value 2`, () => {
	expect(
		parser.parseCommandArgs(
			[{ name: 'command' }, { name: 'arg1', default: 'asdas' }, { name: 'arg2', default: 'odd' }],
			parser.parse(`git remote`)
		)
	).toEqual({
		_: [],
		command: 'git',
		arg1: 'remote',
		arg2: 'odd',
	});
});
