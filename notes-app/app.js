// const fs = require('fs');

// fs.writeFileSync('notes.txt', 'Text to be added in file.');

// fs.appendFileSync('notes.txt', 'Text to be appended in file.');

// const utils = require('./utils')

// let sum = utils(2,1)

// console.log(sum);
// const validator = require('validator')
// const getNotes = require('./notes')

// // const msg = getNotes();

// console.log(validator.isEmail('shivam@gmail.cm'))
// console.log(chalk.blue.inverse.bold('Success!'))

// console.log(process.argv[2])

// Chalk lib

const chalk = require('chalk')
const yargs = require('yargs')
const getNotes = require('./notes')

// Customize yargs version
yargs.version('1.1.0')

// Create yargs command

yargs.command({
    command: 'add',
    describe: 'For adding a new note',
    // A callback
    handler: (arg) => {
        console.log('Adding a note', arg)
    }
})

yargs.parse()