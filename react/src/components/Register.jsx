import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../useAuth';

export default function Register() {
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState(0);
    const [jobTitle, setJobTitle] = useState("")

    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();

        // Send the registration request
        if (!username || !password || !phoneNumber || !location || !salary || !jobTitle) {
            alert("Please fill out all fields");
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/register`, {
            method: "POST",
            body: JSON.stringify({
                "name": username,
                "phone": phoneNumber,
                "location": location,
                "salary": salary,
                "password": password,
                "role": jobTitle
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    // If the server returns an error like 'User already registered'
                    if (data.error === "User already registered") {
                        alert("Error: User already registered!");
                    } else {
                        alert(data.error || "An unknown error occurred.");
                    }
                } else {
                    // Success: User registered successfully
                    if (data.user) {
                        login(data.user);
                    }

                    alert("Registered Successfully");
                    navigate('/employees');
                }
            })
            .catch((error) => {
                // Handle any errors in the fetch call
                console.error(error);
                alert("Something went wrong, please try again later.");
            });
        console.log("Registration sent successfully");
    };

    return (
        <div className="container">
            <form onSubmit={handleRegister} className="mt-5">
                <div className="form-group">
                    <label htmlFor="username">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter Full Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phoneNumber"
                        placeholder="Enter Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Work Location</label>
                    <input
                        type="text"
                        className="form-control"
                        id="location"
                        placeholder="Enter Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="job_title">Job Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="job_title"
                        placeholder="Enter Job Title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="salary">Salary</label>
                    <input
                        type="text"
                        className="form-control"
                        id="salary"
                        placeholder="Enter Salary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <span>
                Already have an account?&nbsp;
                <Link to="/login">Log in!</Link>
            </span>
        </div>
    );
}
