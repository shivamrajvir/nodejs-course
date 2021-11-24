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
    builder: {
        title: {
            describe: 'title of the note',
            demandOption: true, // To make argument compulsory
            type: 'string' // giving type to command
        },
        body: {
            describe: 'body of the note',
            demandOption: true, // To make argument compulsory
            type: 'string' // giving type to command
        }
    },
    handler: (arg) => {
        // console.log('Adding a note', arg)
        console.log('Title a note', arg.title)
        console.log('body a note', arg.body)
    }
})

yargs.command({
    command: 'remove',
    describe: 'For remove a note',
    // A callback
    handler: (arg) => {
        console.log('Removing a note', arg)
    }
})

yargs.command({
    command: 'list',
    describe: 'For listing notes',
    // A callback
    handler: (arg) => {
        console.log('list notes', arg)
    }
})


yargs.command({
    command: 'read',
    describe: 'For reading a note',
    // A callback
    handler: (arg) => {
        console.log('Reading a note', arg)
    }
})


yargs.parse()