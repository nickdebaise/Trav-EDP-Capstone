const express = require('express');
const Employee = require("../models/employee");

const router = express.Router();

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

router.get('/', async (req, res) => {
    try {
        const { name, phone, location } = req.query;

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

        const employees = await Employee.find(filter).populate('managerId', 'name role');


        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching employees.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('managerId', 'name role');

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
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