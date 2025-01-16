const express = require('express');
const Submission = require('../models/submission');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { name, country, company, questions } = req.body;
    console.log('Request Body:', req.body); // Debug incoming data
    console.log('User ID:', req.user.id);   // Debug user ID from auth middleware

    try {
        const submission = new Submission({ name, country, company, questions, userId: req.user.id });
        await submission.save();
        console.log('Submission Created:', submission); // Debug created submission
        res.status(201).json(submission);
    } catch (err) {
        console.error('Error Saving Submission:', err.message); // Debug error
        res.status(500).json({ error: err.message });
    }
});



router.get('/', async (req, res) => {
    const PAGE_SIZE = 10;
    // console.log("the api is hit here")
    try {
        const page = parseInt(req.query.page) || 1; // Get current page, default to 1
        const skip = (page - 1) * PAGE_SIZE; // Calculate how many results to skip
        // Fetch paginated submissions
        const submissions = await Submission.find()
            .skip(skip)
            .limit(PAGE_SIZE);

        // Get total number of submissions for pagination
        const totalSubmissions = await Submission.countDocuments();

        // Calculate total number of pages
        const totalPages = Math.ceil(totalSubmissions / PAGE_SIZE);

        res.json({
            results: submissions,
            total_pages: totalPages,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PAGE_SIZE = 10;

// router.get('/my', async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1; // Get current page, default to 1
//         const skip = (page - 1) * PAGE_SIZE; // Calculate how many results to skip
//         // console.log("request is ", page)
//         // Fetch paginated submissions
//         const submissions = await Submission.find()
//             .skip(skip)
//             .limit(PAGE_SIZE);

//         // Get total number of submissions for pagination
//         const totalSubmissions = await Submission.countDocuments();

//         // Calculate total number of pages
//         const totalPages = Math.ceil(totalSubmissions / PAGE_SIZE);

//         res.json({
//             results: submissions,
//             total_pages: totalPages,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

router.get('/my', auth, async (req, res) => {
    try {
        const email = req.header('email');  // Get email from the request header
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Use the userId to fetch submissions
        const PAGE_SIZE = 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * PAGE_SIZE;

        const submissions = await Submission.find({ userId: user._id })
            .skip(skip)
            .limit(PAGE_SIZE);

        const totalSubmissions = await Submission.countDocuments({ userId: user._id });
        const totalPages = Math.ceil(totalSubmissions / PAGE_SIZE);

        res.json({ results: submissions, total_pages: totalPages });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Submission.findByIdAndDelete(id);
        res.status(200).send({ message: 'Submission deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting submission', error });
    }
});

router.get('/submissions', async (req, res) => {
    console.log("the api is hit here")
    const { page = 1, search = '' } = req.query; // Get page and search from query params
    const limit = 10; // Number of results per page
    const skip = (page - 1) * limit; // Calculate how many documents to skip

    try {
        // Build the search query (case-insensitive for name and company)
        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } }, // Case-insensitive name search
                { company: { $regex: search, $options: 'i' } }, // Case-insensitive company search
            ],
        };

        // Count total results matching the search query
        const totalResults = await Submission.countDocuments(query);

        // Get paginated results matching the query
        const results = await Submission.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            results, // Paginated results
            totalResults, // Total results count
            totalPages: Math.ceil(totalResults / limit), // Total number of pages
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});




module.exports = router;
