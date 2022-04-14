// CRUD related functions

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true }, (error, client) => {
    if (error) {
        console.error(error)
        return
    }
    console.log('connection successful')
    const db = client.db(databaseName)

    const collection = db.collection('users')
    const taskCollection = db.collection('tasks')

    // DELETE ONE AND MANY TASKS

    taskCollection.deleteOne({
        description: 'description 3',
    }).then((response) => {
        console.log(response)
    }, (error) => {
        console.error(error);
    })

    // taskCollection.deleteMany({
    //     completed: false,
    // }).then((response) => {
    //     console.log(response)
    // }, (error) => {
    //     console.error(error);
    // })

    // UPDATE ONE AND MANY

    // taskCollection.updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         inProgress: true
    //     }
    // }).then((response) => {
    //     console.log(response.result, response.modifiedCount, response.message)
    // }).catch((err) => {
    //     console.error(err)
    // })

    // collection.updateOne({
    //     name: "Shivam"
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }).then(response => {
    //     console.log(response);
    //     // modified count, matched count
    // })

    // collection.updateOne({
    //     name: "Shivam"
    // }, {
    //     $set: {
    //         name: 'Shivam 2'
    //     }
    // }).then(response => {
    //     console.log(response);
    //     // modified count, matched count
    // })

    // FIND ONE

    // collection.findOne({ _id: new ObjectID("6207ab5083136c235c4973a1") }, (error, user) => {
    //     if (error) {
    //         console.error('Error while fetching user', error)
    //         return;
    //     }
    //     console.log(user)
    // })

    // FIND

    // collection.find({ name: "Shivam" }).toArray((error, user) => {
    //     if (error) {
    //         console.error('Error while fetching user', error)
    //         return;
    //     }
    //     console.log(user)
    // })

    // collection.find({ name: "Shivam" }).count((error, user) => {
    //     if (error) {
    //         console.error('Error while fetching user', error)
    //         return;
    //     }
    //     console.log(user)
    // })

    // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
    //     if (error) {
    //         console.error('Error while fetching user', error)
    //         return;
    //     }
    //     console.log(tasks)
    // })

    // INSERT ONE

    // db.collection('users').insertOne({
    //     name: 'Shivam',
    //     age: 26
    // }, (error, response) => {
    //     if (error) {
    //         console.error('Error', error)
    //         return
    //     }
    //     response.ops.forEach((obj) => console.log(obj._id))
    //     console.log(response.insertedId)
    // })
    // let users = [
    //     { name: 'Shivam', age: 26 },
    //     { name: 'Rajvir', age: 27 }
    // ]

    // INSERT MANY

    // db.collection('users').insertMany(users, (error, response) => {
    //     if (error) {
    //         console.error('Error', error)
    //         return
    //     }
    //     console.log(response.ops)
    // })

    // db.collection('tasks').insertMany([
    //     { description: 'description 1', completed: true },
    //     { description: 'description 2', completed: false },
    //     { description: 'description 3', completed: false },
    // ], (error, response) => {
    //     if (error) {
    //         console.error('Error', error)
    //         return
    //     }
    //     console.log(response.ops)
    // })
})