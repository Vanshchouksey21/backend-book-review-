const Book = require('../models/Book');

exports.addBook = async (req, res) => {
    const { title, author, genre } = req.body;
    const image = req.file ? req.file.filename : null;
    const book = await Book.create({ title, author, genre, image });
    res.json(book);
};

exports.getBooks = async (req, res) => {
    const books = await Book.find();
    res.json(books);
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch {
        res.status(500).json({ error: 'Error fetching book' });
    }
};
