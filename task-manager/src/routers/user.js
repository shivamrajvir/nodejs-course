const express = require('express');
const router = new express.Router()
const auth = require('../middleware/auth')

const User = require('./../models/user')

router.post('/users', async(req, res) => {
    const user = new User(req.body)

    try {
        const data = await user.save()
        const token = await user.generateAuthToken(req.body.email)
        console.log('saved', data)
        res.send({ user, token })
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
        const token = await user.generateAuthToken(req.body.email)
        console.log(token)
        res.send({ user, token })
    } catch (error) {
        console.error(error)
        res.status(400).send({ error: error.message ? error.message : error })
    }
})

router.post('/user/logout', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

router.post('/user/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(tokenObj => req.token !== tokenObj.token)
        await req.user.save()
        res.send()
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
        // User.find({}).then((users) => {
        //     res.send(users)
        // }, (error) => {
        //     console.error(error)
        //     res.status(500).send(error)
        // });
})

// router.get('/users/:id', async(req, res) => {
//     // User.findOne({ _id: req.params.id }).then((user) => {
//     //     res.send(user)
//     // }, (error) => {
//     //     console.error(error)
//     //     res.status(500).send(error)
//     // });
//     try {
//         const user = await User.findById(req.params.id)
//         if (!user) {
//             return res.status(404).send({})
//         }
//         res.send(user)
//     } catch (error) {
//         console.error(error)
//         res.status(500).send(error)
//     }
//     // User.findById(req.params.id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send({})
//     //     }
//     //     res.send(user)
//     // }, (error) => {
//     //     console.error(error)
//     //     res.status(500).send(error)
//     // });
// })

router.put('/user', auth, async(req, res) => {

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
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
            // below line directly operates on database
            // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            //     new: true,
            //     runValidators: true
            // })
        res.send(req.user)
    } catch (error) {
        console.error(err)
        res.status(500).send(err)
    }
})

router.delete('/user/', auth, async(req, res) => {

    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // console.log(user)
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        console.error(err)
        res.status(500).send(err)
    }
})
module.exports = router