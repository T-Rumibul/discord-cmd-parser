# Discord Args Parser

### Installation 
```sh
yarn add discord-cmd-parser
or
npm install discord-cmd-parser
```
## Usage

```js
// Import package in your project
const Parser = require('discord-cmd-parser');
// Initialize with or without options
const parser = Parser.init()

// args and commands always tranfroms to lower case excemp names of the args and args in quotes

// getCommand()
console.log(parser.getCommand(`!GIT remote testLower "testLower iN Quotes" -namedNotInLower test`)) // ---> { command: 'git', parseArgs: function()}

console.log(parser.getCommand(`!GIT remote testLower "testLower iN Quotes" -namedNotInLower test`).parseArgs()) // ---> {command: 'git', args: {_: ['remote', 'testlower', 'testLower iN Quotes'], namedNotInLower: 'test'}

// parse()
console.log(parser.parse('git remote add origin https://github.com')) // ---> {_:['git', 'remote', 'add', 'origin', 'https://github.com']}

// Or with args definition
console.log(parser.parse('git remote add origin https://github.com', ['command', 'arg1', 'arg2', 'arg3'])) // ---> {_:['https://github.com'], command: 'git', arg1: 'remote', arg2: 'add', arg3: 'origin'}

// You can define args in the string
console.log(parser.parse('-command git -arg1 remote -arg3 add origin https://github.com')) // ---> {_:['https://github.com'], command: 'git', arg1: 'remote', arg2: 'add', arg3: 'origin'}

// Args defined in the string have greater priority then args passed in array
console.log(parser.parse('git -arg1 remote -arg2 add -arg3 origin https://github.com -command replaced'), ['command']) // ---> {_:['git', 'https://github.com'], command: 'replaced', arg1: 'remote', arg2: 'add', arg3: 'origin'}

// Also you can use quotes to define long args with spaces and new lines
console.log(parser.parse(`command "super long arg with spaces or tabs   
or newlines" https://github.com`), ['command', 'longArg', 'link']) // ---> {_:[], command: 'command', longarg: 'super long arg with spaces or tabs or newlines', link: 'https://github.com'}

//  Multiple spaces, tabs and new lines always will be converted to one space
console.log(parser.parse(`command                "super long arg with spaces or tabs   
or newlines"                  https://git           hub.com           `), ['command', 'longArg', 'link']) // ---> {_:['hub.com'], command: 'command', longArg: 'super long arg with spaces or tabs or newlines', link: 'https://git'}
```
## Methods
| Method  | return | Description  | 
| ------------- |:--------------:| ---------- |
| parse(string: string, argsDef?: Array<string>) | Object | Parses string into args.|
| getCommand(string: string, prefix?: prefix) | Object | Parse command from string|
## Options

| Option        | Type          | Deffault | Description  | 
| ------------- |:--------------:| ---------- | -----:|
| prefix | string | "" | pefix to use for getCommand method |
| useQuotes | boolean | true | if false quotes will be ignored | 
| quotesType| string | "|symbol to separate long arg |
|namedSeparator| string | - | symbol to separate named args |

## License
MIT License
Copyright (c) 2020 [RynerNO](https://github.com/RynerNO) <mailto:ryner.no@gmail.com>
