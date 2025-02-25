const express = require('express');
const router = express.Router();

const User = require('../models/user.js')


router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id).populate('books');
    if (!currentUser) {
      return res.redirect('/auth/sign-in');
    }
    res.render('books/index.ejs', {
      books: currentUser.books || [],
      user: currentUser,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


router.get('/new', async (req, res) => {
  res.render('books/new.ejs')
});

router.delete('/:bookId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.books.id(req.params.bookId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/books`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});
// UP
router.put('/:bookId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const book = currentUser.books.id(req.params.bookId);

    book.title = req.body.title;
    book.author = req.body.author;
    book.notes = req.body.notes;

    if (req.body.review && req.body.rating) {
      if (book.reviews && book.reviews.length > 0) {
        book.reviews[0].reviewText = req.body.review;
        book.reviews[0].rating = Number(req.body.rating);
      } else {
        book.reviews.push({
          reviewText: req.body.review,
          rating: Number(req.body.rating)
        });
      }
    }

    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/books/${req.params.bookId}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


//cr
router.post('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    const newBook = {
      title: req.body.title,
      author: req.body.author,
      notes: req.body.notes,
      reviews: []
    };

    if (req.body.review && req.body.rating) {
      newBook.reviews.push({
        reviewText: req.body.review,
        rating: Number(req.body.rating)
      });
    }

    currentUser.books.push(newBook);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/books`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


router.get('/:bookId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const book = currentUser.books.id(req.params.bookId);
    res.render('books/edit.ejs', {
      book: book,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


//show
router.get('/:bookId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const book = currentUser.books.id(req.params.bookId);
    res.render('books/show.ejs', {
      book: book,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
})


module.exports = router;
