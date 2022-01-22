// const fs = require('fs');

// // const book = {
// //     title: 'Ego is enemy',
// //     author: 'Ryan holiday'
// // }

// // const bookJSON = JSON.stringify(book);
// // fs.writeFileSync('1-json.json', bookJSON)

// const dataBuffer = fs.readFileSync('1-json.json')

// let jsonData = JSON.parse(dataBuffer.toString())

// jsonData.name = "Shivam"
// jsonData.age = 26

// console.log(jsonData)
// fs.writeFileSync('1-json.json', JSON.stringify(jsonData))

const tasks = {
    tasks: [{
        text: 'Greocry shopping',
        completed: true
    }, {
        text: 'Clean yard',
        completed: false
    }, {
        text: 'Film course',
        completed: false
    }],
    getTasksToDo() {
        return this.tasks.filter(task => task.completed === false)
    }
}

console.log(tasks.getTasksToDo())