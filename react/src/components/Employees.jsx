import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Employees.css'; // Import external CSS for styling
import { useAuth } from '../useAuth';
import CoinFallBackground from './CoinFallBackground';


const Employees = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [role, setRole] = useState("")
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
                "role": role,
                "location": location,
                "phone": phone
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
            // Check if res is an array before sorting, then its sorting everything alphabetically by first name // then if else if res is not an array , handle accordingly 
            .then(res => {
                if (!res) return;
                if (Array.isArray(res)) {
                    const sortedEmployees = res.sort((a, b) => {
                        return a.name.localeCompare(b.name);
                    });
                    setEmployees(sortedEmployees);
                } else {
                    console.error("Expected array response but got:", res);
                    setEmployees([]);
                }
            })
            .catch(err => {
                alert(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [name, role, phone, location, setLoading]);

    const HandleViewEmployeeDetails = (id) => {
        navigate(`/employee/${id}`);
    };
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
            <CoinFallBackground />
            <form className="search-bar">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Search by name'
                    className="search-input"
                />
                <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder='Search by role'
                    className="search-input"
                />
                <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder='Search by location'
                    className="search-input"
                />
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='Search by phone'
                    className="search-input"
                />
                <button
                    type="submit"
                    onClick={e => {
                        e.preventDefault();
                        fetchEmployees();
                    }}
                    className="search-button"
                >
                    Search
                </button>
            </form>

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
                        <div>
                            <div style={{
                                marginBottom: "8px"
                            }}>
                                {employees.length} Employees Found
                            </div>
                            <div className="employee-cards">

                                {employees.map(employee => (
                                    <div key={employee._id} className="employee-card">
                                        <div>
                                            <h3>{employee.name}</h3>
                                        </div>
                                        <p><strong>Phone:</strong> {employee.phone}</p>
                                        <p><strong>Role:</strong> {employee.role}</p>
                                        <p><strong>Location:</strong> {employee.location}</p>
                                        <p><strong>Salary:</strong> {employee?.salary ?? "Not Viewable"}</p>
                                        <p><strong>Manager:</strong> {employee.managerId?.['name'] ?? "None"}</p>
                                        <button className="btn btn-primary"
                                            style={{ marginRight: '8px' }}
                                            onClick={() => HandleViewEmployeeDetails(employee._id)}>
                                            See more details
                                        </button>
                                        <button className="btn btn-primary" onClick={() => makeManager(employee._id)}
                                            disabled={
                                                employee._id === user._id
                                                || (!!user.managerId && employee._id === user.managerId)
                                            }>Make Manager</button>


                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Employees;
