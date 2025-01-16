import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', email);
            console.log(response.data);
            alert('Login successful');
            navigate('/dashboard');
        } catch (err) {
            console.error(err.message);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-container">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2 style={{ paddingBottom: "15px" }}>Login</h2>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </>
    );
};

export default Login;
