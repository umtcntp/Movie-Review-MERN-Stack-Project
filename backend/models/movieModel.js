const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const movieSchema = new mongoose.Schema(
    {
        movieName: {
            type: String,
            required: [true, "movie name is required"],
        },
        description: {
            type: String,
            required: [true, "description is required"],
        },
        addedBy: {
            type: ObjectId,
            ref: "User",
        },
        image: {
            url: String,
            public_id: String,
        },
        likes: [{ type: ObjectId, ref: "User" }],
        reviews: [
            {
                text: String,
                created: { type: Date, default: Date.now },
                addedBy: {
                    type: ObjectId,
                    ref: "User",
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);