const express = require('express');
const passport = require('passport');
const Employee = require("../models/employee");

const router = express.Router();

router.post('/register', (req, res) => {
    const { name, password, salary, phone, location } = req.body;

    const newEmployee = new Employee({
        name,
        phone,
        location,
        salary,
        role: 'Employee'
    });

    Employee.register(newEmployee, password, (err, employee) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ message: "An account with this name may already exist.", error: err.message });
        }

        passport.authenticate('local')(req, res, () => {
            const employeeData = employee.toObject();
            delete employeeData.hash;
            delete employeeData.salt;
            res.status(201).json({ message: "Registered and logged in successfully!", user: employeeData });
        });
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    const employeeData = req.user.toObject();
    delete employeeData.hash;
    delete employeeData.salt;
    res.status(200).json({ message: "Logged in successfully", user: employeeData });
});

router.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

module.exports = router;