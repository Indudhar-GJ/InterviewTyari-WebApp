const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const submissionRoutes = require('./routes/submissionRoutes');
const userRoutes = require('./routes/userRoutes');


// Load environment variables from .env file
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests (CORS)
app.use(bodyParser.json()); // Parse incoming JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Serve static files (for production builds)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected to Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err.message));

// Routes
app.use('/api/submissions', submissionRoutes);  // Submission routes (CRUD)
app.use('/api/users', userRoutes);  // Authentication routes

// Define the port to run the server on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
