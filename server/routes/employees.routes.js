const express = require('express');
const Employee = require("../models/employee");

const router = express.Router();


router.put('/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized: You must be logged in.' });
    }

    try {
        const { name, phone, location, salary, managerId } = req.body;
        const employeeId = req.params.id;

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        if (req.user.role !== 'Manager' && req.user._id.toString() !== employeeId) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to update this employee.' });
        }

        employee.name = name ?? employee.name;
        employee.phone = phone ?? employee.phone;
        employee.location = location ?? employee.location;
        employee.salary = salary ?? employee.salary;
        employee.managerId = managerId ?? employee.managerId;

        const updatedEmployee = await employee.save();
        res.status(200).json(updatedEmployee);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error while updating employee.' });
    }
});


router.post('/search', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized: You must be logged in.' });
    }

    try {
        const authenticatedUserId = req.user._id.toString();

        const { name, phone, location } = req.body;

        const filter = {};
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (phone) filter.phone = { $regex: phone };
        if (location) filter.location = { $regex: location, $options: 'i' };

        const employees = await Employee.find(filter)
            .populate('managerId', 'name role')
            .lean();

        const processedEmployees = employees.map(employee => {
            const isManager = employee.managerId && employee.managerId._id.toString() === authenticatedUserId;
            const isSelf = employee._id.toString() === authenticatedUserId;

            if (isManager || isSelf) {
                return employee;
            } else {
                delete employee.salary;
                return employee;
            }
        });

        res.status(200).json(processedEmployees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while fetching employees.' });
    }
});

module.exports = router;