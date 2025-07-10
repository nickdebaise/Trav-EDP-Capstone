const express = require('express');
const Employee = require("../models/employee");

const router = express.Router();

/*

{
name: ...
phone ...
manager ...
subordinates ...
}

*/

router.get("/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized: You must be logged in." });
    }

    try {
        const authenticatedUserId = req.user._id.toString();
        const authenticatedUser = await Employee.findById(authenticatedUserId).select('role');

        const employeeId = req.params.id;

        const employee = await Employee.findById(employeeId).populate('managerId');

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        const isSelf = employee._id.toString() === authenticatedUserId;
        const isHR = authenticatedUser.role === "HR";
        const isViewingOwnSubordinate = employee.managerId?._id?.toString() === authenticatedUserId;

        let employeeObject = employee.toObject();

        if (!isSelf && !isHR && !isViewingOwnSubordinate) {
            employeeObject.salary = "Not Viewable";
        }

        if (employeeObject.managerId) {
            if (!isHR) {
                employeeObject.managerId.salary = "Not Viewable";
            }
        }

        const subordinates = await Employee.find({
            managerId: employeeId
        }).lean();

        const processedSubordinates = subordinates.map(subordinate => {
            const isManagerOfSubordinate = subordinate.managerId?.toString() === authenticatedUserId;
            const isViewingOwnProfileInSubList = subordinate._id.toString() === authenticatedUserId;

            if (isManagerOfSubordinate || isViewingOwnProfileInSubList || isHR) {
                return subordinate;
            } else {
                delete subordinate.salary;
                return subordinate;
            }
        });

        employeeObject.subordinates = processedSubordinates;

        res.status(200).json(employeeObject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while fetching employee.' });
    }
});

router.put('/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized: You must be logged in.' });
    }

    try {
        const { managerId } = req.body;
        const employeeIdToUpdate = req.params.id;
        const authenticatedUserId = req.user._id.toString();

        const authenticatedUser = await Employee.findById(authenticatedUserId).select('role');
        const employeeToUpdate = await Employee.findById(employeeIdToUpdate);

        if (!employeeToUpdate) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        const isHR = authenticatedUser.role === "HR";
        const isCurrentManager = employeeToUpdate.managerId?.toString() === authenticatedUserId;
        const isSelf = employeeToUpdate?._id.toString() === authenticatedUserId;

        if (managerId !== undefined && !isHR && !isCurrentManager && !isSelf) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to change this employee\'s manager.' });
        }

        if (managerId) {
            const potentialNewManager = await Employee.findById(managerId);
            if (potentialNewManager?.managerId?.toString() === employeeIdToUpdate || potentialNewManager?._id.toString() === authenticatedUserId) {
                return res.status(400).json({ message: "Invalid operation: Cannot create a circular management chain." });
            }
        }

        const { name, phone, location, salary, role } = req.body;
        employeeToUpdate.name = name ?? employeeToUpdate.name;
        employeeToUpdate.phone = phone ?? employeeToUpdate.phone;
        employeeToUpdate.location = location ?? employeeToUpdate.location;

        employeeToUpdate.role = role ?? employeeToUpdate.role;
        employeeToUpdate.salary = salary ?? employeeToUpdate.salary;

        if (managerId !== undefined) {
            employeeToUpdate.managerId = managerId;
        }

        await employeeToUpdate.save();

        const populatedEmployee = await employeeToUpdate.populate('managerId', 'name role');

        res.status(200).json(populatedEmployee);

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        console.log(err);
        res.status(500).json({ message: 'Server error while updating employee.' });
    }
});

router.post('/search', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized: You must be logged in.' });
    }

    try {
        const authenticatedUserId = req.user._id.toString();


        const authenticatedUser = await Employee.findOne({ _id: authenticatedUserId });

        const { name, phone, location, role } = req.body;

        const filter = {};
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (phone) filter.phone = { $regex: phone };
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (role) filter.role = { $regex: role, $options: 'i' }
        const employees = await Employee.find(filter)
            .populate('managerId', 'name role')
            .lean();

        const processedEmployees = employees.map(employee => {
            const isManager = employee.managerId && employee.managerId._id.toString() === authenticatedUserId;
            const isSelf = employee._id.toString() === authenticatedUserId;
            const isHR = authenticatedUser.role === "HR"

            if (isManager || isSelf || isHR) {
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