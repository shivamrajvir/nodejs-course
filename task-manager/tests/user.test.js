const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const { userOne, userOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up a new user', async() => {
    const response = await request(app)
        .post('/users')
        .send({ name: "Shivam Rajvir", email: "shivamrajvir@gmail.com", password: "Shivam@12345" })
        .expect(200)

    // assert user is saved in db
    const user = await User.findOne({ _id: response.body.user._id })
    expect(user).not.toBeNull()

    // assert about response is
    expect(response.body).toMatchObject({
        user: {
            name: "Shivam Rajvir",
            email: "shivamrajvir@gmail.com"
        },
        token: user.tokens[0].token
    })

    expect(response.body.user.password).not.toBe(userOne.password)
})

test('Should be able to login', async() => {
    const response = await request(app)
        .post('/user/login')
        .send({ email: userOne.email, password: userOne.password })
        .expect(200)

    const user = await User.findById(userOneId)
    if (user) {
        expect(response.body.token).toBe(user.tokens[1].token)
    }

})

test('Should not login non-existing users', async() => {
    await request(app)
        .post('/user/login')
        .send({ email: 'test@gmail.com', password: userOne.password })
        .expect(400)
})

test('get users profile', async() => {
    await request(app)
        .get('/users/me')
        .set("Authorization", userOne.tokens[0].token)
        .send()
        .expect(200)
})

test('get users profile when not authorized', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('delete user failed', async() => {
    await request(app)
        .delete('/user')
        .send()
        .expect(401)
})

test('delete user', async() => {
    await request(app)
        .delete('/user')
        .set("Authorization", userOne.tokens[0].token)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should up load avatar', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set("Authorization", userOne.tokens[0].token)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update user fields', async() => {
    await request(app)
        .put('/user')
        .set("Authorization", userOne.tokens[0].token)
        .send({ name: 'Shivam Rajvir' })
        .expect(200)

    const user = await User.findById(userOneId)
    console.log(user)
    expect(user.name).toEqual('Shivam Rajvir')
})

test('should not update invalid user fields', async() => {
    await request(app)
        .put('/user')
        .set("Authorization", userOne.tokens[0].token)
        .send({ location: 'Shivam Rajvir' })
        .expect(400)

})

exports.module = {
    userOne
}