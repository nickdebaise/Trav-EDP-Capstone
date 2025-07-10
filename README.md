# Travelers Companies EDP Capstone Project
## Searchable Enterprise Directory

*Goal*
1. Develop a web app to view and search for employees in an enterprise
Employee Information should include
    1. Name
    2. Phone Number
    3. Job Role
    4. Location
    5. Salary
    6. Manager
2. Design a Machine Learning model to predict an employee’s salary given their job role & location
3. Salary is confidential
    1. Employees can see their own salary
    2. Managers can see the salary of their direct reports
    3. Human Resources can see everyone’s salary

# Project Structore

```
/
prediction engine
  -> Holds the flask server for making predictions of salaries
react
  -> Holds the react frontend web app
server
  -> Holds the express js backend server and mongodb models
training
  -> Holds the data & training scripts for the trained ML model
```

# How to run?

```
cd react && npm install && npm run dev
```
```
cd server && npm install && npm run start
```
```
cd prediction_engine && pip install flask pandas flask-cors && python server.py
```

# How to use?
Navigate to `localhost:5173`.
Register a new user
Login using the name and password
Go to `localhost:5173/employees`