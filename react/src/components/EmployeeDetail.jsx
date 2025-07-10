import React from 'react';
import { useParams } from 'react-router-dom';
import './Employees.css';

const EmployeeDetail = () => {
    const { id } = useParams();
    
    return (
        <div className="employee-detail-container">
            <h2>Hi</h2>
            <p>You're viewing employee ID: {id}</p>
        </div>
    );
};

export default EmployeeDetail;
