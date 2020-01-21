const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    page: {
        type: Number,
        required: true,
        trim: true
    },
    _shelfId: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    _bookId: {
        type: mongoose.Types.ObjectId,
        require: true,
    }
    //TODO Add timestamp of when it was created
})

const Note = mongoose.model('Note', NoteSchema);

module.exports = { Note }