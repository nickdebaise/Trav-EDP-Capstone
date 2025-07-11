import React, { useState, useRef, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CoinFallBackground from './CoinFallBackground';
import './LittleMan.css';

const ROLES = ["Software Engineer", "Data Scientist", "Project Manager", "UX Designer", "EDP"]
const LOCATIONS = ['New York', 'Hartford', "Saint Paul"]

export default function Prediction() {
    const [predictedSalary, setPredictedSalary] = useState("");
    const [jobRole, setJobRole] = useState("");
    const [location, setLocation] = useState("");
    const [isShocked, setIsShocked] = useState(false);

    // Reset shock state when inputs change
    useEffect(() => {
        if (predictedSalary === "") {
            setIsShocked(false);
        }
    }, [predictedSalary]);

    const predictSalary = (e) => {
        e.preventDefault();

        if (!jobRole || !location) {
            alert("Please select both a job role and location");
            return;
        }

        fetch(`${import.meta.env.VITE_API_PREDICTION_URL}/predict`, {
            method: "POST",
            body: JSON.stringify({
                job_title: jobRole,
                work_location: location
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);

                if (data && typeof data === 'object') {
                    if (data.salary !== undefined) {
                        setPredictedSalary(data.salary);
                    } else if (data.predicted_salary !== undefined) {
                        setPredictedSalary(data.predicted_salary);
                    } else if (data.prediction !== undefined) {
                        setPredictedSalary(data.prediction);
                    } else {
                        const firstValue = Object.values(data).find(val =>
                            typeof val === 'number' || !isNaN(parseFloat(val))
                        );
                        if (firstValue !== undefined) {
                            setPredictedSalary(firstValue);
                        }
                    }
                } else if (typeof data === 'number' || !isNaN(parseFloat(data))) {
                    setPredictedSalary(data);
                }
                
                // Trigger the shocked animation
                setIsShocked(true);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    return (
        <div className="container py-5">
            <CoinFallBackground />
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">Salary Prediction</h3>
                        </div>
                        <div className="card-body">
                            {/* Little character container */}
                            <div className="character-container mb-3 text-center">
                                <div className={`little-man ${isShocked ? 'shocked' : ''}`}>
                                    {/* Face */}
                                    <div className="face">
                                        <div className="eyes">
                                            <div className="eye left"></div>
                                            <div className="eye right"></div>
                                        </div>
                                        <div className={`mouth ${isShocked ? 'shocked-mouth' : ''}`}></div>
                                    </div>
                                    {/* Body */}
                                    <div className="body"></div>
                                    {/* Arms */}
                                    <div className={`arms ${isShocked ? 'shocked-arms' : ''}`}>
                                        <div className="arm left"></div>
                                        <div className="arm right"></div>
                                    </div>
                                    {/* Speech bubble that appears when shocked */}
                                    {isShocked && (
                                        <div className="speech-bubble">
                                            <p>WOW!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Form onSubmit={predictSalary}>
                                <div className="form-group mb-3">
                                    <label htmlFor="jobRole" className="form-label">Job Role</label>
                                    <select className="form-control"
                                        id="jobRole" onChange={e => {
                                            setJobRole(e.target.value);
                                            setPredictedSalary("");
                                        }} value={jobRole}>
                                        <option value={""} disabled>-- Select Role --</option>
                                        {
                                            ROLES.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="location" className="form-label">Location</label>
                                    <select className="form-control"
                                        id="location" onChange={e => {
                                            setLocation(e.target.value);
                                            setPredictedSalary("");
                                        }} value={location}>
                                        <option value={""} disabled>-- Select Location --</option>
                                        {
                                            LOCATIONS.map(location => (
                                                <option key={location} value={location}>{location}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <Button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={!jobRole || !location}
                                >
                                    Predict Salary
                                </Button>
                            </Form>

                            {predictedSalary !== "" && predictedSalary !== undefined &&
                                <div className="alert alert-success mt-4 text-center">
                                    <h4 className="mb-0">Predicted Salary: ${typeof predictedSalary === 'number' ?
                                        predictedSalary.toLocaleString() : predictedSalary}</h4>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}






/*import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CoinFallBackground from './CoinFallBackground'; // Assuming you have this component

const ROLES = ["Software Engineer", "Data Scientist", "Project Manager", "UX Designer", "EDP"]
const LOCATIONS = ['New York', 'Hartford', "Saint Paul"]

export default function Prediction() {
    const [predictedSalary, setPredictedSalary] = useState("");
    const [jobRole, setJobRole] = useState("");
    const [location, setLocation] = useState("");

    const predictSalary = (e) => {
        e.preventDefault();

        if (!jobRole || !location) {
            alert("Please select both a homeworld and unit type");
            return;
        }

        fetch(`${import.meta.env.VITE_API_PREDICTION_URL}/predict`, {
            method: "POST",
            body: JSON.stringify({
                job_title: jobRole,
                work_location: location
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);

                if (data && typeof data === 'object') {
                    if (data.salary !== undefined) {
                        setPredictedSalary(data.salary);
                    } else if (data.predicted_salary !== undefined) {
                        setPredictedSalary(data.predicted_salary);
                    } else if (data.prediction !== undefined) {
                        setPredictedSalary(data.prediction);
                    } else {
                        const firstValue = Object.values(data).find(val =>
                            typeof val === 'number' || !isNaN(parseFloat(val))
                        );
                        if (firstValue !== undefined) {
                            setPredictedSalary(firstValue);
                        }
                    }
                } else if (typeof data === 'number' || !isNaN(parseFloat(data))) {
                    setPredictedSalary(data);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    return (
        <div className="container py-5">
            <CoinFallBackground />
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">Salary Prediction</h3>
                        </div>
                        <div className="card-body">
                            <Form onSubmit={predictSalary}>
                                <div className="form-group mb-3">
                                    <label htmlFor="jobRole" className="form-label">Job Role</label>
                                    <select className="form-control"
                                        id="jobRole" onChange={e => {
                                            setJobRole(e.target.value);
                                            setPredictedSalary("");
                                        }} value={jobRole}>
                                        <option value={""} disabled>-- Select Role --</option>
                                        {
                                            ROLES.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="location" className="form-label">Location</label>
                                    <select className="form-control"
                                        id="location" onChange={e => {
                                            setLocation(e.target.value);
                                            setPredictedSalary("");
                                        }} value={location}>
                                        <option value={""} disabled>-- Select Location --</option>
                                        {
                                            LOCATIONS.map(location => (
                                                <option key={location} value={location}>{location}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <Button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={!jobRole || !location}
                                >
                                    Predict Salary
                                </Button>
                            </Form>

                            {predictedSalary !== "" && predictedSalary !== undefined &&
                                <div className="alert alert-success mt-4 text-center">
                                    <h4 className="mb-0">Predicted Salary: ${typeof predictedSalary === 'number' ?
                                        predictedSalary.toLocaleString() : predictedSalary}</h4>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
*/