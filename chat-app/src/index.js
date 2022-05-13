const express = require('express');
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const badWordsFilter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { getUser, addUser, removeUser, getUsersInRoom } = require('./utils/users')

const filterWords = new badWordsFilter();

const app = express()
const server = http.createServer(app)
const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')
const io = socketio(server)

app.use(express.json())

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

let count = 0

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // socket.emit('message', generateMessage('Welcome!'))
    // socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

        callback()
            // io.to.emit - emits everyone in room, socket.broadcast.to.emi - emits everyone in room except sender

    })

    socket.on('sendMessage', (message, callback) => {
        if (message) {
            if (filterWords.isProfane(message)) { return callback('Profanity not allowed') }
            const user = getUser(socket.id)
            if (user)
                io.to(user.room).emit('message', generateMessage(user.username, filterWords.clean(message)))
        }

        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        let locText = `https://google.com/maps?=${coords.lat},${coords.long}`
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, locText));
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} user has left!`))
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
        }

    })
})

server.listen(port, () => {
    console.log('Server started on port ' + port)
})