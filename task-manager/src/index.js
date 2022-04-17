const express = require('express');
require('./db/mongoose') // just so file runs and mongoose is connected

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server started on port ' + port)
})


const jwt = require('jsonwebtoken');
const e = require('express');
const Task = require('./models/task');
const User = require('./models/user');

const test = async() => {
    // const task = await Task.findById('625c0334837a5621b03228d2')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    const user = await User.findById('625bff4cd0ccd50ff00d9791')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

test();