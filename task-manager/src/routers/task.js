const express = require('express');
const router = new express.Router()
const auth = require('../middleware/auth')

const Task = require('./../models/task')

router.post('/tasks', auth, async(req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.send(task)
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
    // task.save().then((data) => {
    //     console.log('saved', data)
    //     res.send(task)
    // }, (error) => {
    //     console.error(error)
    //     res.status(400).send(error)
    // });
})

router.get('/tasks', auth, async(req, res) => {
    try {
        // 1st way
        // const tasks = await Task.find({ owner: req.user._id })
        // 2nd way
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }, (error) => {
    //     console.error(error)
    //     res.status(500).send(error)
    // });
})

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send({ error: 'No task found for current user' })
        }
        res.send(task)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
    // Task.findById(req.params.id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send({})
    //     }
    //     res.send(task)
    // }, (error) => {
    //     console.error(error)
    //     res.status(500).send(error)
    // });
})

router.put('/tasks/:id', auth, async(req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdatesHash = { 'description': true, 'completed': true }
    const isValidOperation = updates.every((update) => {
        return allowedUpdatesHash[update]
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body parameters sent!' })
    }

    try {
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })
        if (!task) {
            return res.status(404).send({ error: 'Task not found' })
        }
        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
            // console.log(task)
        if (!task) {
            return res.status(404).send({ error: 'task not found' })
        }
        res.send(task)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

module.exports = router