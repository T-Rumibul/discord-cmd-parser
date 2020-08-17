import Parser from './index';
const parser = Parser();
test('test with default args without args definition', () => {
	expect(parser.parse('git remote add origin https://github.com')).toEqual({
		_: ['git', 'remote', 'add', 'origin', 'https://github.com'],
	});
});

test('test with whitespaces and named args without args definition', () => {
	expect(parser.parse('git remote add -origin   "http s:/  /gi thub.com"')).toEqual({
		_: ['git', 'remote', 'add'],
		origin: 'http s:/ /gi thub.com',
	});
});

test(`test with whitespaces and new lines without args definition`, () => {
	expect(
		parser.parse(`git                     remote                add -origin
	"http s:/ /gi thub.com"`)
	).toEqual({
		_: ['git', 'remote', 'add'],
		origin: 'http s:/ /gi thub.com',
	});
});

test(`test with whitespaces and new lines and quotes without args definition`, () => {
	expect(
		parser.parse(`git    "test quotes for match" "dddd dddd" -test "another named arg with quotes" -testTwo withoutQuotes                 remote                add -origin
	"http s:/ /gi thub.com"`)
	).toEqual({
		_: ['git', 'test quotes for match', 'dddd dddd', 'remote', 'add'],
		test: 'another named arg with quotes',
		testTwo: 'withoutQuotes',
		origin: 'http s:/ /gi thub.com',
	});
});

test(`test named from the start of the string`, () => {
	expect(parser.parse(`-git add remote`)).toEqual({
		_: ['remote'],
		git: 'add',
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

test(`test for duplicate args`, () => {
	expect(
		parser.parse(`git remote add and "other dasds" -arg2 replace -_ error`, [
			'command',
			'arg1',
			'arg2',
		])
	).toEqual({
		_: ['add', 'and', 'other dasds'],
		command: 'git',
		arg1: 'remote',
		arg2: 'replace',
	});
});
