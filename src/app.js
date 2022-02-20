// npm modules,
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// express,
const app = express();
const port = process.env.PORT;

// database,
mongoose.connect(process.env.DATABASE_URL);

// express middleware,
app.use(express.json());

// router modules,
const userRoutes = require('./routers/userRoutes');
const taskRoutes = require('./routers/taskRoutes');

// maintenance mode //////////////////////////////////////

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back later!');
// });

//////////////////////////////////////////////////////////
// routes section,
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => console.log('listening on port', port));

// const jwt = require('jsonwebtoken');

// const func = async () => {
//     const token = jwt.sign({ _id: 'akash1198' }, 'test-environment', { expiresIn: '90 seconds' });
//     console.log(token);
//     const data = jwt.verify(token, 'test-environment');
//     console.log(data);
// };

// func();

// const Task = require('./models/taskModel');
// const User = require('./models/userModel');

// const main = async function () {
//     // const task = await Task.findById('620f1e3e98ecd0a0f98add0e').populate('owner').exec();
//     // console.log(task.owner);
//     const user = await User.findById('620de95f347d51cfd6596e58').populate('tasks').exec();
//     console.log(user.tasks);
// };

// main();
