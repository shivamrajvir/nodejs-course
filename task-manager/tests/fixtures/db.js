//@ts-check
const User = require('../../src/models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Task = require('../../src/models/task')


const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    name: 'Shivam',
    email: 'shivam@gmail.com',
    password: "Shivam@12345",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }],
    _id: userOneId
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    name: 'test',
    email: 'test@gmail.com',
    password: "Test@12345",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }],
    _id: userTwoId
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test description',
    completed: false,
    owner: userOneId,
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test description 2',
    completed: true,
    owner: userOneId,
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test description 3',
    completed: true,
    owner: userTwoId,
}

const setupDatabase = async() => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOne,
    userOneId,
    setupDatabase,
    userTwo,
    taskOne
}