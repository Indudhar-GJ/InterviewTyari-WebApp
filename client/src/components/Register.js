import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Register.css'; // Import the CSS file

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users/register', { name, email, password });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error(err.message);
            alert('Registration failed. Try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="register-container">
                <form className="register-form" onSubmit={handleRegister}>
                    <h2>Join Us</h2>
                    <p className="register-text">Create your account today!</p>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email Address"
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
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
            </div>
        </>
    );
};

export default Register;
