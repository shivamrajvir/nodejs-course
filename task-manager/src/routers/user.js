const express = require('express');
const router = new express.Router()
const auth = require('../middleware/auth')

const User = require('./../models/user')

const multer = require('multer')
const sharp = require('sharp')

router.post('/users', async(req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken(req.body.email)
            // sendWelcomeEmail(user.email, user.name)
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
        console.log(req.user)
        res.send(req.user)
    } catch (error) {
        console.error(err)
        res.status(500).send(err)
    }
})

router.delete('/user', auth, async(req, res) => {
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

const upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 1000000 // size in bytes 
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
            callback(new Error('Please upload images with jpg, png format'))
        }
        callback(null, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
        // req.user.avatar = req.file.buffer // buffer can only be accessed if dest is removed
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error('')
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        console.error(error)
        res.status(404).send()
    }
})

module.exports = router