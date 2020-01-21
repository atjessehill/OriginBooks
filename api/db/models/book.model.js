const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
    },
    author: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
    },
    _shelfId: {
        type: mongoose.Types.ObjectId,
        require: true,
    }
})

const Book = mongoose.model('Book', BookSchema);

module.exports = { Book }