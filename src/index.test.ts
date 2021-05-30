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
			parser.parse(`git remote add and "other dasds"`),
			{
				command: {
					default: ""
				},
				arg1: {
					default: ""
				},
				arg2: {
					default: ""
				}	
			}
			,
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
			parser.parse(`git remote add and "other dasds"`),
			{
				command: {
					default: ""
				},
				arg1: {
					default: ""
				},
				arg2: {
					default: "odd"
				}	
			}
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
			parser.parse(`git remote`),
			{
				command: {
					default: ""
				},
				arg1: {
					default: "asdas"
				},
				arg2: {
					default: "odd"
				}	
			}
			
		
		)
	).toEqual({
		_: [],
		command: 'git',
		arg1: 'remote',
		arg2: 'odd',
	});
});

test(`test args definition default with empty object`, () => {
	expect(
		parser.parseCommandArgs(
			parser.parse(`git remote`),
			{}
			
		
		)
	).toEqual({
		_: ["git", "remote"],
	});
});