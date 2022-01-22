const fs = require('fs')
const chalk = require('chalk')

const fileName = 'notesDB.json';



const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync(fileName)
        return JSON.parse(dataBuffer.toString())
    } catch (e) {
        return []
    }
}

const saveNotes = (notes) => {
    fs.writeFileSync(fileName, JSON.stringify(notes))
}

const getNotes = () => {
    let data = loadNotes()
    console.log(chalk.yellow('Your notes...'))
    data.forEach(note => console.log(note.title))
        // console.log(data)
}

const getANote = (title) => {
    const notes = loadNotes()
    let noteObj = notes.find((note) => note.title === title)
    if (!noteObj) {
        console.log(chalk.red('No note found'))
    } else {
        console.log(chalk.blue(noteObj.title), noteObj.body)
    }
}

const addNote = (title, body) => {
    let notes = loadNotes()
    const doesNoteExist = notes.find((noteObj) => noteObj.title === title)
    if (doesNoteExist) {
        console.log(chalk.red('Note with this title already exists'));
        return
    }
    notes.push({
        title: title,
        body: body
    })
    saveNotes(notes)
    console.log(chalk.green('Note added successfully'));
}



const removeNote = (title) => {
    const notes = loadNotes()
    const notesToKeep = notes.filter(note => note.title !== title)
    if (notesToKeep.length !== notes.length) {
        saveNotes(notesToKeep)
        console.log(chalk.green('Note removed successfully'));
    } else {
        console.log(chalk.red('No note found'));
    }


}

// getNotes();

module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    getNotes: getNotes,
    getANote: getANote
}