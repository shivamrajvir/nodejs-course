const express = require('express');
const router = new express.Router()


const User = require('./../models/user')

router.post('/users', async(req, res) => {
    const user = new User(req.body)

    try {
        const data = await user.save()
        console.log('saved', data)
        res.send(user)
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
    // user.save().then((data) => {
    //     console.log('saved', data)
    //     res.send(user)
    // }, (error) => {
    //     console.error(error)
    //     res.status(400).send(error)
    // });
})

router.post('/user/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log(user)
        res.send(user)
    } catch (error) {
        console.error('reached', error)
        res.status(400).send(error)
    }
})

router.get('/users', async(req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
    // User.find({}).then((users) => {
    //     res.send(users)
    // }, (error) => {
    //     console.error(error)
    //     res.status(500).send(error)
    // });
})

router.get('/users/:id', async(req, res) => {
    // User.findOne({ _id: req.params.id }).then((user) => {
    //     res.send(user)
    // }, (error) => {
    //     console.error(error)
    //     res.status(500).send(error)
    // });
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send({})
        }
        res.send(user)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
    // User.findById(req.params.id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send({})
    //     }
    //     res.send(user)
    // }, (error) => {
    //     console.error(error)
    //     res.status(500).send(error)
    // });
})

router.put('/users/:id', async(req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdatesHash = { 'name': true, 'email': true, 'password': true, 'age': true }
    const isValidOperation = updates.every((update) => {
        return allowedUpdatesHash[update]
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body parameters sent!' })
    }

    try {

        // code for updating via middlware

        const user = await User.findById(req.params.id)
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
            // below line directly operates on database
            // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            //     new: true,
            //     runValidators: true
            // })
        console.log(user)
        if (!user) {
            return res.status(404).send({})
        }
        res.send(user)
    } catch (error) {
        console.error(err)
        res.status(500).send(err)
    }
})

router.delete('/users/:id', async(req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id)
        console.log(user)
        if (!user) {
            return res.status(404).send({ error: 'User not found' })
        }
        res.send(user)
    } catch (error) {
        console.error(err)
        res.status(500).send(err)
    }
})
module.exports = router