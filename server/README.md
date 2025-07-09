# Server Documentation

## Authentication

## Employee Routes

### POST /employees

Create a new employee.

In the request body, supply (in JSON), a name, role (Employee, Manager), phone, salary, location to create a new employee
Optionally, supply a managerId with an ID which points to another manager/employee to set this employee to be a subordinate of the supplied ID

### PUT /employees/:id

Update an existing employee (i.e. to set their manager)
Same as POST /employees

### Post /employees/search

Search for all employees.

In the request body, supply (in JSON), a name, phone, location to filter for the given people that meet this criteria

In the request body, supply a userId which is the ID of the given user in order to show salaries for people below them.
