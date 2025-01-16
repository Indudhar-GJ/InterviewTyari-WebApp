// const jwt = require('jsonwebtoken');

// // Authentication middleware
// const auth = async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
//     if (!token) {
//         return res.status(401).json({ message: 'Authentication token missing or invalid' });
//     }
//     try {
//         // Use the JWT_SECRET from the environment variables to verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Secret used here
//         req.user = decoded; // Attach decoded user data to the request
//         next();
//     } catch (err) {
//         console.error('Auth Error:', err.message);
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// module.exports = auth;

const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user info (like ID) to the request
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
module.exports = auth;
