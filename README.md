  

# Discord Args Parser

## Installation

```sh
yarn add discord-cmd-parser
or
npm install discord-cmd-parser

```

## Usage
```js
// Import package in your project
const  Parser = require('discord-cmd-parser');

// Initialize with or without options
const  parser = Parser.createParser()
// args and commands always tranfroms to lower case excemp names of the args and args in quotes  

// parse()
console.log(parser.parse('git remote add origin https://github.com')) // ---> {_:['git', 'remote', 'add', 'origin', 'https://github.com']}

// Or with args definition
console.log(parser.parse('git remote add origin https://github.com', ['command', 'arg1', 'arg2', 'arg3'])) // ---> {_:['https://github.com'], command: 'git', arg1: 'remote', arg2: 'add', arg3: 'origin'}

// Also you can use quotes to define long args with spaces and new lines
console.log(parser.parse(`command "super long arg with spaces or tabs
or newlines" https://github.com`), ['command', 'longArg', 'link']) // ---> {_:[], command: 'command', longarg: 'super long arg with spaces or tabs or newlines', link: 'https://github.com'}

// Multiple spaces, tabs and new lines always will be converted to one space
console.log(parser.parse(`command "super long arg with spaces or tabs
or newlines" https://git hub.com `), ['command', 'longArg', 'link']) // ---> {_:['hub.com'], command: 'command', longArg: 'super long arg with spaces or tabs or newlines', link: 'https://git'}

console.log(parser.parseCommandArgs( parser.parse(`git remote test1 test2`), {command: { default: ""}, arg1: { default: "asdas" }, arg2: { default: "odd" }})) // ---> {_: ["test2"], command: 'git', arg1: 'remote',arg2: 'test1'}

```
## Methods

| Method | return | Description |
| ------ | ------ | ----------- |
| parse(string: string) | []string | Parses string into args.|
| parseCommandArgs(parsedMessage: string[], commandArgsDef: IargsDefinition[]) | Object | assign parsed string to args.|
| disableQuotes() | void | Disables parsing args in quotes as one.|
| enableQuotes() | void | Enable parsing args in quotes as one.|
| changeQuotesType(value: string) | void | Change quotes type.|
## Options

| Option | Type | Deffault | Description |
| -------| ------ | ------ | ----------- | 
| useQuotes | boolean | true | if false quotes will be ignored | 
| quotesType| string | "|symbol to separate long arg |

## License

[MIT License](https://github.com/T-Rumibul/discord-cmd-parser/blob/master/LICENSE)

Copyright (c) 2021 [Andrew](https://github.com/T-Rumibul) <t.rumibul.work@gmail.com>