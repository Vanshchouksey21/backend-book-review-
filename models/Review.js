const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId: mongoose.Schema.Types.ObjectId,
    reviewText: String,
    rating: Number,
    reviewer: String
});

module.exports = mongoose.model('Review', reviewSchema);
