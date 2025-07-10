import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Employees = () => {

    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const [employees, setEmployees] = useState([]);


    useEffect(() => {
        fetchEmployees();
    }, [])

    const fetchEmployees = useCallback(() => {
        setLoading(true)
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
                    navigate("/")
                }

                return response.json()
            })
            .then(res => {
                if (!res) return
                setEmployees(res)
            })
            .catch(err => {
                alert(err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [name, setLoading])

    return (
        <div>
            <div>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Search name' />
                <button role="button" type="button" onClick={fetchEmployees}>
                    Search
                </button>
            </div>
            {
                loading ? (
                    <div>
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    <div>
                        {(employees?.length ?? 0) === 0 ? (
                            <div>
                                <h2>No results</h2>
                            </div>
                        ) : (

                            <div className="table_component" role="region">
                                <table>
                                    <caption>Results</caption>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Role</th>
                                            <th>Location</th>
                                            <th>Salary</th>
                                            <th>Manager?</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            employees.map(employee => {
                                                return (
                                                    <tr key={employee._id}>
                                                        <td>{employee.name}</td>
                                                        <td>{employee.phone}</td>
                                                        <td>{employee.role}</td>
                                                        <td>{employee.location}</td>
                                                        <td>{employee?.salary ?? "Not Viewable"}</td>
                                                        <td>{employee.managerId?.['name']}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    );
};

export default Employees;