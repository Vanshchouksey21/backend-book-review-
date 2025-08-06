const express = require('express');
const multer = require('multer');
const Book = require('../models/Book');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/books', upload.single('image'), async (req, res) => {
    try {
        const { title, author, genre } = req.body;
        const image = req.file ? req.file.filename : '';
        const newBook = new Book({ title, author, genre, image });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json({ error: 'Book upload failed.' });
    }
});

router.get('/books', async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

module.exports = router;
