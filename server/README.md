# Server Docs

## Authentication

Authentication is session-based and handled via cookies. You must log in to receive a session cookie, which must then be sent with all subsequent requests to protected routes.

### `POST /register`
Registers a new employee account.

*   **Request Body:**
    ```json
    {
      "name": "Jane Doe",
      "password": "strongpassword123",
      "phone": "555-123-4567",
      "location": "New York, NY"
    }
    ```
*   **Response:** On success, returns a `201` status, a confirmation message, and automatically logs the user in.

### `POST /auth/login`
Logs in an existing user and creates a session.

*   **Request Body:**
    ```json
    {
      "name": "Jane Doe",
      "password": "strongpassword123"
    }
    ```
*   **Response:** On success, returns a `200` status and sets a session cookie.

### `POST /auth/logout`
Logs out the current user and destroys the session.

---

## Employee Routes

All routes under `/employees` are protected and require the user to be authenticated.

### `PUT /employees/:id`
Updates an existing employee's details.

*   **URL Parameter:** `:id` - The MongoDB ObjectId of the employee to update.
*   **Authorization:** The authenticated user must be either:
    1.  The employee they are trying to update (updating their own profile).
    2.  A manager of that employee
*   **Request Body:** Any combination of the fields below. All are optional.
    ```json
    {
        "name": "Johnathan Smith",
        "phone": "860 910 9087",
        "location": "hartford",
        "salary": 65000,
        "managerId": "60d5ec49f72e1c3a88d1f2b4"
    }
    ```

### `POST /employees/search`
Searches for employees based on filter criteria.

*   **Authorization:** Requires authentication. The API automatically uses the authenticated user's ID from their session to determine permissions.
*   **Request Body:** All fields are optional filters.
    ```json
    {
        "name": "j",
        "location": "new york"
    }
    ```
*   **Response:** Returns an array of employee objects. The `salary` field will only be included for employees who are either:
    1.  The authenticated user themselves.
    2.  A subordinate of the authenticated user

For all other employees, the `salary` field is omitted for privacy.