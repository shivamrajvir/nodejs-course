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


const jwt = require('jsonwebtoken')

const test = async() => {
    const secret = 'thisismynewcourse'
    const token = jwt.sign({ _id: 'Shivam23' }, secret, { expiresIn: '0 seconds' })
    console.log(token)

    console.log(jwt.verify(token, secret))
}

test();