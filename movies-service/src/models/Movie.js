import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1000,
      trim: true
    },
    year: {
      type: Number,
      required: true,
      min: 1800
    },
    genres: {
      type: [String],
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

movieSchema.index({ name: 'text', description: 'text' });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
