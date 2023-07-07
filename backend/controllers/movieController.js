const cloudinary = require('../utils/cloudinary');
const Movie = require('../models/movieModel');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../app');

//create movie
exports.createMovie = async (req, res, next) => {
    const { movieName, description, addedBy, image, likes, reviews } = req.body;

    try {
        //upload image in cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "images",
            width: 1200,
            crop: "scale"
        })
        const movie = await Movie.create({
            movieName,
            description,
            addedBy: req.user._id,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },

        });
        res.status(201).json({
            success: true,
            movie
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}




//show movies
exports.showMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 }).populate('addedBy', 'name');
        res.status(201).json({
            success: true,
            movies
        })
    } catch (error) {
        next(error);
    }

}

//show single movie
exports.showSingleMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('reviews.addedBy', 'name');
        res.status(200).json({
            success: true,
            movie
        })
    } catch (error) {
        next(error);
    }

}


//delete movie
exports.deleteMovie = async (req, res, next) => {
    const currentMovie = await Movie.findById(req.params.id);

    //delete movie image in cloudinary       
    const ImgId = currentMovie.image.public_id;
    if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
    }

    try {
        const movie = await Movie.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "movie deleted"
        })

    } catch (error) {
        next(error);
    }

}


//update movie
exports.updateMovie = async (req, res, next) => {
    try {
        const { movieName, description, image } = req.body;
        const currentMovie = await Movie.findById(req.params.id);

        //build the object data
        const data = {
            movieName: movieName || currentMovie.movieName,
            description: description || currentMovie.description,
            image: image || currentMovie.image,
        }

        //modify movie image conditionally
        if (req.body.image !== '') {

            const ImgId = currentMovie.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: 'images',
                width: 1200,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }

        }

        const movieUpdate = await Movie.findByIdAndUpdate(req.params.id, data, { new: true });

        res.status(200).json({
            success: true,
            movieUpdate
        })

    } catch (error) {
        next(error);
    }

}



//add review
exports.addReview = async (req, res, next) => {
    const { review } = req.body;
    try {
        const movieReview = await Movie.findByIdAndUpdate(req.params.id, {
            $push: { reviews : { text: review, addedBy: req.user._id } }
        },
            { new: true }
        );
        const movie = await Movie.findById(movieReview._id).populate('reviews.addedBy', 'name email');
        res.status(200).json({
            success: true,
            movie
        })

    } catch (error) {
        next(error);
    }

}


//add like
exports.addLike = async (req, res, next) => {

    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, {
            $addToSet: { likes: req.user._id }
        },
            { new: true }
        );
        const movies = await Movie.find().sort({ createdAt: -1 }).populate('addedBy', 'name');
        main.io.emit('add-like', movies);

        res.status(200).json({
            success: true,
            movie,
            movies
        })

    } catch (error) {
        next(error);
    }

}


//remove like
exports.removeLike = async (req, res, next) => {

    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.user._id }
        },
            { new: true }
        );

        const movies = await Movie.find().sort({ createdAt: -1 }).populate('addedBy', 'name');
        main.io.emit('remove-like', movies);

        res.status(200).json({
            success: true,
            movie
        })

    } catch (error) {
        next(error);
    }

}