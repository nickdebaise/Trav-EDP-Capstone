const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Employee name is required.'],
        trim: true
    },

    phone: {
        type: String,
        required: false
    },

    role: {
        type: String,
        required: true,
        enum: ['Employee', 'Manager'],
        default: 'Employee'
    },

    location: {
        type: String,
        trim: true,
    },

    salary: {
        type: Number,
        required: [true, 'Salary is required.'],
        min: [0, 'Salary cannot be negative.']
    },

    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null
    }
});

module.exports = mongoose.model('Employee', employeeSchema);