import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeDetail.css';
import CoinFallBackground from './CoinFallBackground';

const EmployeeCard = ({ employee, onNavigate, isCurrentUser = false }) => {
    if (!employee) {
        return null;
    }

    const cardClasses = `employee-card org-card ${isCurrentUser ? 'current-user-card' : ''}`;

    return (
        <div className={cardClasses}>
            <CoinFallBackground/>
            <h3>{employee.name}</h3>
            <p><strong>Role:</strong> {employee.role}</p>
            {!isCurrentUser && (
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onNavigate(employee._id)}
                >
                    View Details
                </button>
            )}
        </div>
    );
};


const EmployeeDetail = () => {
    const [loading, setLoading] = useState(false);
    const [employee, setEmployee] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchEmployee = useCallback(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/employees/${id}`, {
            credentials: 'include',
        })
            .then((response) => {
                if (response.status === 401) {
                    navigate("/");
                    login(null)
                }
                if (!response.ok) {
                    throw new Error('Employee not found');
                }
                return response.json();
            })
            .then((res) => {
                if (!res) return;
                setEmployee(res);
            })
            .catch((err) => {
                console.error(err);
                setEmployee(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, navigate]);

    useEffect(() => {
        if (!id) return;
        fetchEmployee();
    }, [id, fetchEmployee]);

    const handleNavigate = (employeeId) => {
        navigate(`/employee/${employeeId}`);
    };

    if (loading) {
        return (
            <div className="employee-detail-page">
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="employee-detail-page">
                <h1>Employee Not Found</h1>
                <p>Could not find details for employee ID: {id}</p>
            </div>
        );
    }

    return (
        <div className="employee-detail-page">
            <h2>Org Chart for {employee.name}</h2>

            <div className="org-chart">
                {employee.managerId && (
                    <div className="node manager">
                        <EmployeeCard employee={employee.managerId} onNavigate={handleNavigate} />
                    </div>
                )}

                <div className="node current-employee">
                    <EmployeeCard employee={employee} isCurrentUser={true} />
                </div>

                {employee.subordinates && employee.subordinates.length > 0 && (
                    <div className="subordinates-container">
                        {employee.subordinates.map((sub) => (
                            <div key={sub._id} className="node subordinate">
                                <EmployeeCard employee={sub} onNavigate={handleNavigate} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeDetail;