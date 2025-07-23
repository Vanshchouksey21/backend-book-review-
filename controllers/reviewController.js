const Review = require('../models/Review');

exports.addReview = async (req, res) => {
    const { reviewText, rating } = req.body;
    const review = await Review.create({
        bookId: req.params.bookId,
        reviewText,
        rating,
        reviewer: req.user.username
    });
    res.json(review);
};

exports.getReviews = async (req, res) => {
    const reviews = await Review.find({ bookId: req.params.bookId });
    const avgRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(2)
        : 0;
    res.json({ reviews, avgRating });
};
