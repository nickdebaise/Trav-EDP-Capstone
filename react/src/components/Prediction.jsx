import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CoinFallBackground from './CoinFallBackground'; // Assuming you have this component

export default function Prediction(props){
    const [predictedSalary, setPredictedSalary] = useState("");
    const [jobRole, setJobRole] = useState(props.job_role || "");
    const [location, setLocation] = useState(props.location || "");
    
    const predictSalary = (e) => {
        e.preventDefault();
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
    
    return(
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
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="jobRole"
                                        placeholder="Enter Job Role"
                                        value={jobRole}
                                        onChange={(e) => setJobRole(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group mb-3">
                                    <label htmlFor="location" className="form-label">Location</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="location"
                                        placeholder="Enter Location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        required
                                    />
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
