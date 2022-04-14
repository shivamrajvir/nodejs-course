require('../src/db/mongoose')

const Task = require('../src/models/task')

// Task.findByIdAndDelete('6234983188074e3220342e93').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((taskCount) => {
//     console.log(taskCount)
// }).catch((err) => {
//     console.error(err)
// })

const findAndDelete = async(id, completedFlag) => {
    const task = await Task.findByIdAndDelete(id)
    const taskCount = await Task.countDocuments({ completed: completedFlag })
    return taskCount;
}

findAndDelete('6234983188074e3220342e93', false).then((count) => {
    console.log(count)
}, (error) => {
    console.error(error)
})