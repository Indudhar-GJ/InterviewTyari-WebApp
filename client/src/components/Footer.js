import React from 'react';
import './Footer.css'; // Import the CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>© {new Date().getFullYear()} Interview Tyari. All rights reserved.</p>
                <ul className="footer-links">
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                    <li><a href="/terms-of-service">Terms of Service</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                </ul>
                <p>Powered by <a href="https://yourcompanywebsite.com" target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none" }}>Interview Tyari</a></p>
            </div>
        </footer>
    );
};

export default Footer;
