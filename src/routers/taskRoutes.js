const express = require('express');

const auth = require('../middleware/authentication');

// models,
const Task = require('../models/taskModel');

const router = express.Router();

router.get('/tasks', auth, async (req, res) => {
    const match = { owner: req.user._id };
    // const options = { limit: 1 };
    if (req.query.completed) match.isCompleted = req.query.completed === 'true';

    try {
        const tasks = await Task.find(match);
        res.status(200).send(tasks);
        // await req.user.populate('tasks').exec();
        // res.status(200).send(req.user.tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) return res.status(404).send();

        res.status(200).send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedKeys = ['taskName', 'description', 'isCompleted'];
    const isValidOperation = keys.every(key => allowedKeys.includes(key));

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid Updates!' });

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) return res.status(404).send();

        keys.forEach(key => (task[key] = req.body[key]));
        task.save();
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true,
        // });

        res.status(200).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) return res.status(404).send();

        res.status(200).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
