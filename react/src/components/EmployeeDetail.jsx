import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './Employees.css';

const EmployeeDetail = () => {
    const [loading, setLoading] = useState(false)
    const [employee, setEmployee] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        fetchEmployee();
    }, [id]);

    const fetchEmployee = useCallback(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/employees/${id}`, {
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
                console.log(res)
                setEmployee(res);
            })
            .catch(err => {
                alert(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, setLoading]);

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        )
    }

    if (!employee) {
        return (
            <div>
                <h1>Employee Not Found</h1>
            </div>
        )
    }

    return (
        <div className="employee-detail-container">
            <h2>{employee.name}</h2>
            <p>You're viewing employee ID: {id}</p>
        </div>
    );
};

export default EmployeeDetail;
