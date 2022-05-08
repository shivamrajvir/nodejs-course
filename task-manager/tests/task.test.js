const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')

const { userOne, setupDatabase, userTwo, taskOne } = require('./fixtures/db')

beforeEach(setupDatabase)

test('should create task for user', async() => {
    const response = await request(app)
        .post('/tasks')
        .set("Authorization", userOne.tokens[0].token)
        .send({
            "description": "Task from production DB",
            "completed": false
        })
        .expect(200)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should get tasks for user 1', async() => {
    const taskList = await request(app)
        .get('/tasks')
        .set("Authorization", userOne.tokens[0].token)
        .expect(200)

    expect(taskList.body.length).toEqual(2)
})

test('user 2 cannot delete tasks for user 1', async() => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", userTwo.tokens[0].token)
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})