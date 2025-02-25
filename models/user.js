const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    reviews: [
        {
            reviewText: { type: String, required: true },
            rating: { type: Number, min: 1, max: 5 },
            date: { type: Date, default: Date.now },
        }
    ],
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    books: [bookSchema],

});

const User = mongoose.model("User", userSchema);

module.exports = User;
