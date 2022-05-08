const express = require('express');
require('./db/mongoose') // just so file runs and mongoose is connected

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app;