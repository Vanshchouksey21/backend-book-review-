const Book = require('../models/Book');

exports.addBook = async (req, res) => {
    const { title, author, genre } = req.body;
    const image = req.file ? req.file.filename : null;
    const book = await Book.create({ title, author, genre, image });
    res.json(book);
};

exports.getBooks = async (req, res) => {
    const { genre, author } = req.query;
    const filter = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = author;
    const books = await Book.find(filter);
    res.json(books);
};
