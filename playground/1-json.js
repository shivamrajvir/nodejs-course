const fs = require('fs');

// const book = {
//     title: 'Ego is enemy',
//     author: 'Ryan holiday'
// }

// const bookJSON = JSON.stringify(book);
// fs.writeFileSync('1-json.json', bookJSON)

const dataBuffer = fs.readFileSync('1-json.json')

let jsonData = JSON.parse(dataBuffer.toString())

jsonData.name = "Shivam"
jsonData.age = 26

console.log(jsonData)
fs.writeFileSync('1-json.json', JSON.stringify(jsonData))