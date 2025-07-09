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

employeeSchema.plugin(passportLocalMongoose, { usernameField: 'name' });


employeeSchema.statics.updateRoleBasedOnSubordinates = async function (employeeId) {
    if (!employeeId) return;

    const Employee = this;
    const subordinate = await Employee.findOne({ managerId: employeeId });

    if (subordinate) {
        await Employee.findByIdAndUpdate(employeeId, { role: 'Manager' });
    } else {
        await Employee.findByIdAndUpdate(employeeId, { role: 'Employee' });
    }
};

employeeSchema.pre('save', async function (next) {
    if (this.isModified('managerId')) {
        const originalDoc = await this.constructor.findById(this._id);
        if (originalDoc && originalDoc.managerId) {
            await this.constructor.updateRoleBasedOnSubordinates(originalDoc.managerId);
        }
    }
    next();
});

employeeSchema.post('save', async function (doc) {
    if (doc.managerId) {
        await doc.constructor.updateRoleBasedOnSubordinates(doc.managerId);
    }
});


module.exports = mongoose.model('Employee', employeeSchema);