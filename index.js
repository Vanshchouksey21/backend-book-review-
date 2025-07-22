const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bookreview', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

// JWT Secret
const JWT_SECRET = "secret_key";

// Models
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String
}));

const Book = mongoose.model('Book', new mongoose.Schema({
    title: String,
    author: String,
    genre: String
}));

const Review = mongoose.model('Review', new mongoose.Schema({
    bookId: mongoose.Schema.Types.ObjectId,
    reviewText: String,
    rating: Number,
    reviewer: String
}));

// Middleware
const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(400).json({ error: "Invalid token" });
    }
};

// Routes

// Signup
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.json({ message: "Signup successful" });
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
    res.json({ token });
});

// Add Book
app.post('/api/books', authMiddleware, async (req, res) => {
    const { title, author, genre } = req.body;
    const book = await Book.create({ title, author, genre });
    res.json(book);
});

// Get Books (with filters)
app.get('/api/books', async (req, res) => {
    const { genre, author } = req.query;
    const filter = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = author;
    const books = await Book.find(filter);
    res.json(books);
});

// Add Review
app.post('/api/reviews/:bookId', authMiddleware, async (req, res) => {
    const { reviewText, rating } = req.body;
    const review = await Review.create({
        bookId: req.params.bookId,
        reviewText,
        rating,
        reviewer: req.user.username
    });
    res.json(review);
});

// Get Reviews for a Book + Avg Rating
app.get('/api/reviews/:bookId', async (req, res) => {
    const reviews = await Review.find({ bookId: req.params.bookId });
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(2)
        : 0;
    res.json({ reviews, avgRating });
});

// Server start
app.listen(5000, () => console.log("Backend running on port 5000"));
