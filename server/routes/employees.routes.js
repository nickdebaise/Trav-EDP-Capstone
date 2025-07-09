const express = require('express');
const Employee = require("../models/employee");

const router = express.Router();

// Add a new employee
router.post('/', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error while creating employee.' });
    }
});

router.post('/search', async (req, res) => {
    try {
        const { name, phone, location, userId } = req.body;

        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (phone) {
            filter.phone = { $regex: phone };
        }
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        const employees = await Employee.find(filter)
            .populate('managerId', 'name role')
            .lean();

        const processedEmployees = employees.map(employee => {
            const isManager = userId
                && employee.managerId
                && employee.managerId._id.toString() === userId;

            if (isManager) {
                return employee;
            } else {
                delete employee.salary;
                return employee;
            }
        });

        res.status(200).json(processedEmployees);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching employees.' });
    }
});

router.post('/employee', async (req, res) => {
    try {
        const { id, userId } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Employee ID must be provided in the request body.' });
        }

        const employee = await Employee.findById(id)
            .populate('managerId', 'name role')
            .lean();

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        const isManager = userId
            && employee.managerId
            && employee.managerId._id.toString() === userId;

        if (!isManager) {
            delete employee.salary;
        }

        res.status(200).json(employee);

    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid employee ID format.' });
        }
        res.status(500).json({ message: 'Server error while fetching employee.' });
    }
});

module.exports = router;