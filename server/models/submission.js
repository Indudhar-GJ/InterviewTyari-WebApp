const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        country: { type: String, required: true },
        company: { type: String, required: true },
        questions: { type: [String], required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    }
);

module.exports = mongoose.model('Submission', submissionSchema);
