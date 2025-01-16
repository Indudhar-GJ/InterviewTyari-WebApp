import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './NewSubmission.css'; // Import the CSS file
import Footer from './Footer';

const NewSubmission = () => {
    const [submissions, setSubmissions] = useState([]);
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [company, setCompany] = useState('');
    const [questions, setQuestions] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchSubmissions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/submissions', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSubmissions(response.data);
            } catch (err) {
                console.error(err.message);
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchSubmissions();
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:5000/api/submissions',
                { name, country, company, questions: questions.split(',') },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubmissions([...submissions, response.data]);
            // Clear the form fields
            setName('');
            setCountry('');
            setCompany('');
            setQuestions('');
            // Display success alert
            alert('Submission successful!');
        } catch (err) {
            console.error(err.message);
            alert('Submission successful!');
        }
    };

    return (
        <>
            <Navbar />
            <div className="new-submission-wrapper">
                <h1 className="new-submission-title">New Submission</h1>
                <form className="new-submission-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="new-form-input"
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        className="new-form-input"
                    />
                    <input
                        type="text"
                        placeholder="Company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                        className="new-form-input"
                    />
                    <textarea
                        placeholder="Questions (comma-separated)"
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                        required
                        className="new-form-textarea"
                    />
                    <button type="submit" className="new-form-button">Submit</button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default NewSubmission;
