const fs = require('fs')

let getNotes = function () {
    let data = fs.readFileSync('notes.txt').toString();
    return data;
}

// getNotes();

module.exports = getNotes;