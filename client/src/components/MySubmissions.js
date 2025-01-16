import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './MySubmissions.css';
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import Footer from './Footer';

const MySubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [page, setPage] = useState(1); // Current page number
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [message, setMessage] = useState([]);
    const [viewQuestion, setViewQuestion] = useState(false);
    const [viewQuestionID, setViewQuestionID] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchMySubmissions = async () => {
            try {
                const email = localStorage.getItem('email');  // Get email from localStorage
                if (!email) {
                    // Handle case where email is not found in localStorage
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/submissions/my?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        email: email  // Pass email in the request header
                    },
                });
                setSubmissions(response.data.results);
                setTotalPages(response.data.total_pages);
            } catch (err) {
                console.error('Error fetching submissions:', err.message);
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };


        fetchMySubmissions();
    }, [token, navigate, page]); // Re-run when page changes

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/submissions/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubmissions(submissions.filter((submission) => submission._id !== id));
        } catch (err) {
            console.error(err.message);
            alert('Failed to delete. Try again.');
        }
    };

    const viewMessage = (id) => {
        for (let submission of submissions) {
            if (submission._id === id) {
                setMessage(submission.questions); // Store questions as an array

                setViewQuestion((prev) => (id === viewQuestionID ? !prev : true));
                setViewQuestionID(id === viewQuestionID && viewQuestion ? null : id);
            }
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="my-submissions">
            <Navbar />
            <h2 className="my-submissions-title">My Submissions</h2>
            <ul className="submission-list">
                {submissions?.map((submission) => (
                    <li
                        className="submission-item"
                        key={submission._id}
                        onClick={() => viewMessage(submission._id)}
                    >
                        <div className="submission-header">
                            <strong className="submission-name">{submission.name}</strong>
                            <span className="submission-company">{submission.company}</span>
                            <button
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(submission._id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                        <div
                            className={`submission-details ${viewQuestion && submission._id === viewQuestionID ? 'show' : 'hide'
                                }`}
                        >
                            {viewQuestion && submission._id === viewQuestionID && (
                                <div className="questions-list">
                                    {message.map((question, index) => (
                                        <>
                                            <span key={index}>{question}</span>
                                            <br />
                                        </>
                                    ))}
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="pagination-button"
                >
                    <GrPrevious />
                </button>
                <span className="page-number">Page {page} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="pagination-button"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <GrNext />
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default MySubmissions;
