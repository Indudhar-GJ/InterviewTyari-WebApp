import React, { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../image/logo.png';

const Navbar = memo(() => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 610);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleResize = () => {
        setIsMobileView(window.innerWidth < 610);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <nav style={styles.navbar}>

            <div style={styles.navbarHeader}>
                <div style={{ display: 'flex', justifyContent: "space-between", width: '100%' }}>
                    {isMobileView && (
                        <>
                            <span style={styles.brand}><img src={logo} alt="" /></span>
                            <button
                                onClick={toggleDropdown}
                                style={styles.menuButton}
                                className="menu-button"
                            >
                                &#9776;
                            </button>
                        </>
                    )}
                </div>

                {/* Menu List */}
                <ul
                    style={{
                        ...styles.navList,
                        ...(isMobileView ? (isDropdownOpen ? styles.navListDropdown : styles.navListHidden) : styles.navListNormal)
                    }}
                >
                    {/* Links group */}
                    <div
                        style={{
                            ...styles.navLinksGroup,
                            flexDirection: isMobileView ? 'column' : 'row', // Change layout based on screen width
                        }}
                    >
                        {!isMobileView && <span style={styles.brand}><img style={{ width: "150px" }} src={logo} alt="" /></span>}
                        <li style={styles.navItem}>
                            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
                        </li>
                        <li style={styles.navItem}>
                            <Link to="/my-submissions" style={styles.navLink}>My Submissions</Link>
                        </li>
                        <li style={styles.navItem}>
                            <Link to="/new-submission" style={styles.navLink}>New submission</Link>
                        </li>
                    </div>

                    {/* Login / Logout items */}
                    {token ? (
                        <li style={styles.navItem}>
                            <button onClick={handleLogout} style={styles.button}>Logout</button>
                        </li>
                    ) : (
                        <div style={{ display: 'flex' }}>
                            <li style={styles.navItem}>
                                <Link to="/login" style={styles.navLink}>Login</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/register" style={styles.navLink}>Register</Link>
                            </li>
                        </div>
                    )}
                </ul>
            </div>
        </nav >
    );
});

const styles = {
    navbar: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#333',
        color: '#fff',
        padding: '0.5rem 1rem',
    },
    navbarHeader: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brand: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    menuButton: {
        fontSize: '1.5rem',
        background: 'none',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
    },
    navList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    navListNormal: {
        display: 'flex',
        flexDirection: 'row', // Horizontal layout for larger screens
    },
    navListDropdown: {
        flexDirection: 'column',
        display: 'flex',
    },
    navListHidden: {
        display: 'none',
    },
    navLinksGroup: {
        display: 'flex',
        flexDirection: 'row', // Default to row
    },
    navItem: {
        margin: '0.5rem 1rem',
    },
    navLink: {
        textDecoration: 'none',
        color: '#fff',
    },
    button: {
        backgroundColor: '#555',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderRadius: '4px',
    },
};

export default Navbar;
