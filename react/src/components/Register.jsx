import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../useAuth';
import CoinFallBackground from './CoinFallBackground';

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
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "85vh" }}>
            <CoinFallBackground />
            <div className="row w-100 justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white text-center">
                            <h3 className="mb-0">Register</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleRegister}>
                                <div className="form-group mb-3">
                                    <label htmlFor="username" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Enter Full Name"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phoneNumber"
                                        placeholder="Enter Phone Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="location" className="form-label">Work Location</label>
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
                                <div className="form-group mb-3">
                                    <label htmlFor="job_title" className="form-label">Job Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="job_title"
                                        placeholder="Enter Job Title"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="salary" className="form-label">Salary</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="salary"
                                        placeholder="Enter Salary"
                                        value={salary}
                                        onChange={(e) => setSalary(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Register</button>
                            </form>
                            <div className="mt-3 text-center">
                                <span>
                                    Already have an account?&nbsp;
                                    <Link to="/"className="text-primary">Log in!</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
