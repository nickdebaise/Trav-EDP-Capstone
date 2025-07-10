const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Employee name is required.'],
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
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

employeeSchema.plugin(passportLocalMongoose, { usernameField: 'name' });

module.exports = mongoose.model('Employee', employeeSchema);