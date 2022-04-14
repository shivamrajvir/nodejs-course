const express = require('express');
const router = new express.Router()


const Task = require('./../models/task')

router.post('/tasks', async(req, res) => {
    const task = new Task(req.body)
    try {
        const data = await task.save()
        console.log('saved', data)
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

router.get('/tasks', async(req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
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

router.get('/tasks/:id', async(req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).send({})
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

router.put('/tasks/:id', async(req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdatesHash = { 'description': true, 'completed': true }
    const isValidOperation = updates.every((update) => {
        return allowedUpdatesHash[update]
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid body parameters sent!' })
    }

    try {
        const task = await Task.findById(req.params.id)
        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })
        console.log(task)
        if (!task) {
            return res.status(404).send({})
        }
        res.send(task)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', async(req, res) => {

    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        console.log(task)
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