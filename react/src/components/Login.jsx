import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../useAuth';

export default function LoginForm() {
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: "POST",
            body: JSON.stringify({
                "name": username,
                "password": password
            }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.user) {
                    login(data.user)
                }
                alert(data.message);
                navigate('/employees');
            })
            .catch((error) => {
                // Handle any errors
                console.error(error);
            });
        console.log("Login sent successfully");
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center"  >

                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">Login</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleLogin}>
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
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                            </form>
                            <div className="mt-3 text-center">
                                <span>
                                    Don't have an account?&nbsp;
                                    <Link to="/register" className="text-primary">Register!</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
