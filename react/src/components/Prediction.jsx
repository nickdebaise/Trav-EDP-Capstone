import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


export default function Prediction(props){
    const [predicted_salary, setPrediction] = useState("");
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
            // Handle the response data
            setPrediction(data.salary)
            console.log(data);
        })
        .catch((error) => {
            // Handle any errors
            console.error(error);
        });
        console.log('Prediction Request submitted');
    }
    
    return(
        <div className="container py-5">
            <h2>Salary Prediction</h2>
            <Form className="my-3">
                <Form.Group className="mb-3">
                    <Form.Label>Job Role</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter job role" 
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                    />
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter location" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </Form.Group>
                
                <Button 
                    onClick={predictSalary} 
                    disabled={!jobRole || !location}
                >
                    Predict Salary
                </Button>
            </Form>
            
            {predicted_salary !== "" && 
                <div className="mt-3">
                    <h4>Predicted Salary: ${predicted_salary}</h4>
                </div>
            }
        </div>
    )
}
