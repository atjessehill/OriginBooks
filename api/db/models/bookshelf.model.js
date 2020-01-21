const mongoose = require('mongoose');

const ShelfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Shelf = mongoose.model('Shelf', ShelfSchema);

module.exports = { Shelf }