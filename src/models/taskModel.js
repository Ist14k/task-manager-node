const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const taskSchema = new Schema(
    {
        taskName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
