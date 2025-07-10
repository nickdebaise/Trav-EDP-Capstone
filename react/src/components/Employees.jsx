import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Employees.css'; // Import external CSS for styling
import { useAuth } from '../useAuth';

const Employees = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const { login, user } = useAuth()

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = useCallback(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/employees/search`, {
            method: "POST",
            body: JSON.stringify({
                "name": name,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        })
            .then((response) => {
                if (response.status === 401) {
                    navigate("/");
                    login(null)
                }

                return response.json();
            })
            .then(res => {
                if (!res) return;
                setEmployees(res);
            })
            .catch(err => {
                alert(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [name, setLoading]);

    const makeManager = useCallback((newManagerId) => { // 'id' renamed for clarity
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/employees/${user._id}`, {
            method: "PUT",
            body: JSON.stringify({
                "managerId": newManagerId
            }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        })
            .then((response) => {
                if (response.status === 401) {
                    navigate("/");
                    login(null);
                    return;
                }
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Failed to update manager.');
                    });
                }
                return response.json();
            })
            .then(updatedUserFromServer => {
                if (!updatedUserFromServer) return;

                alert("Manager has been updated successfully!");

                const newManagerData = updatedUserFromServer.managerId?._id;

                login({
                    ...user,
                    managerId: newManagerData
                });

                fetchEmployees();
            })
            .catch(err => {
                console.error(err);
                alert(`Error: ${err.message}`);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user, login, navigate, fetchEmployees]);

    return (
        <div className="employee-container">
            <div className="search-bar">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Search by name'
                    className="search-input"
                />
                <button
                    type="button"
                    onClick={fetchEmployees}
                    className="search-button"
                >
                    Search
                </button>
            </div>

            {loading ? (
                <div className="loading">
                    <h2>Loading...</h2>
                </div>
            ) : (
                <div>
                    {(employees?.length ?? 0) === 0 ? (
                        <div>
                            <h2>No results found</h2>
                        </div>
                    ) : (
                        <div className="employee-cards">
                            {employees.map(employee => (
                                <div key={employee._id} className="employee-card">
                                    <div>
                                        <h3>{employee.name}</h3>
                                        <button onClick={() => makeManager(employee._id)}
                                            disabled={
                                                employee._id === user._id
                                                || (!!user.managerId && employee._id === user.managerId)
                                            }>Make Manager</button>
                                    </div>
                                    <p><strong>Phone:</strong> {employee.phone}</p>
                                    <p><strong>Role:</strong> {employee.role}</p>
                                    <p><strong>Location:</strong> {employee.location}</p>
                                    <p><strong>Salary:</strong> {employee?.salary ?? "Not Viewable"}</p>
                                    <p><strong>Manager:</strong> {employee.managerId?.['name'] ?? "None"}</p>
                                    <button className="btn btn-primary">
                                        Make this person my manager
                                    </button>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Employees;
