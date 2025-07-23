const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

router.post('/:bookId', authMiddleware, reviewController.addReview);
router.get('/:bookId', reviewController.getReviews);

module.exports = router;
