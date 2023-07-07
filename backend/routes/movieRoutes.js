const express = require('express');
const router = express.Router();
const { createMovie, showMovies, showSingleMovie , deleteMovie, updateMovie, addReview, addLike, removeLike} = require('../controllers/movieController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

//movie routes
router.post('/movie/create', isAuthenticated, isAdmin, createMovie);
router.get('/movies/show', showMovies);
router.get('/movie/:id', showSingleMovie);
router.delete('/delete/movie/:id', isAuthenticated, isAdmin, deleteMovie);
router.put('/update/movie/:id', isAuthenticated, isAdmin, updateMovie);
router.put('/review/movie/:id', isAuthenticated, addReview);
router.put('/addlike/movie/:id', isAuthenticated, addLike);
router.put('/removelike/movie/:id', isAuthenticated, removeLike);

module.exports = router;