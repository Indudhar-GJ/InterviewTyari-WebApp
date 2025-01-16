import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Dashboard.css'; // Import the CSS file
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import Footer from './Footer';

// Utility function to highlight search matches
const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi'); // Case-insensitive search
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
};

// Utility function to format date
const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const time = date.toLocaleString('en-US', options).toLowerCase();
    return `${time} ${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
};

const Dashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalResults, setTotalResults] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/submissions/submissions`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page, search: searchQuery },
                });
                setSubmissions(response.data.results);
                setTotalPages(response.data.totalPages);
                setTotalResults(response.data.totalResults);
            } catch (err) {
                console.error(err.message);
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchSubmissions();
    }, [token, navigate, page, searchQuery]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(1); // Reset to the first page when searching
    };

    return (
        <div className="dashboard-wrapper">
            <Navbar />
            <h2 className="dashboard-subtitle">All Submissions</h2>
            <div className="search" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <input
                    style={{ width: '40%', padding: '10px', fontSize: '16px', borderRadius: "15px" }}
                    type="text"
                    className="search-bar"
                    placeholder="Search by name or company..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>
            <ul className="submissions-list">
                {submissions.map((submission) => (
                    <ul key={submission._id} className="submission-item">
                        <strong
                            style={{ fontSize: '24px' }}
                            dangerouslySetInnerHTML={{
                                __html: highlightText(submission.name, searchQuery),
                            }}
                        />
                        <br />
                        <span
                            style={{ color: 'gray' }}
                            dangerouslySetInnerHTML={{
                                __html: highlightText(submission.company, searchQuery),
                            }}
                        />
                        <br />
                        <span style={{ color: 'gray' }}>{submission.country}</span>
                        <br />
                        <span style={{ color: 'gray', fontStyle: 'italic' }}>
                            Submitted on: {formatDate(submission.createdAt)}
                        </span>
                        <div style={{ padding: '20px 30px' }}>
                            {submission.questions.map((q, index) => (
                                <p
                                    key={index}
                                    dangerouslySetInnerHTML={{
                                        __html: highlightText(q, searchQuery),
                                    }}
                                />
                            ))}
                        </div>
                    </ul>
                ))}
            </ul>
            {totalResults === 0 && <p style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>No results found.</p>}
            {totalResults > 0 && (
                <div className="pagination">
                    <button
                        className="pagination-button"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <GrPrevious />
                    </button>
                    <span className="pagination-page">{`Page ${page} of ${totalPages} (${totalResults} results)`}</span>
                    <button
                        className="pagination-button"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        <GrNext />
                    </button>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Dashboard;
