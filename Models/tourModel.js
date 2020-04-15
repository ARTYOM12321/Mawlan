//Atwanen bley Schema Functioneka aw datayay daxle dakay check daka w error habet nahelet bcheta database aka
const slugify = require('slugify');
const mongoose = require('mongoose');
//const User = require('./UserModel');
//const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'PUT ERROR HERE'],
      unique: true,
      maxlength: [40, 'PUT ERROR HERE(less or equal'],
      minlength: [10, 'put ERROR HERE(more or equal)']
      //validate: [validator.isAlpha, 'PUT ERROR HERE']
    },
    slug: String,

    duration: {
      type: Number,
      required: [true, 'PUT ERROR HERE']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'PUT ERROR HERE']
    },
    difficulty: {
      type: String,
      required: [true, 'TOUR MUST HAVE A difficulty'], //JUST SHORT HAND OF WHATS BELOW
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'PUT ERROR HERE'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be above 1.0'],
      max: [5, 'must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },

    price: {
      type: Number,
      required: [true, 'PUT ERROR HERE']
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'PUT ERROR HERE']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'PUT ERROR HERE']
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    startLocation: {
      //geoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        coordinates: [Number],
        address: String,
        description: String
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.virtual('AliADurationWeeks').get(function() {
  return this.duration / 7;
});

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v'
  });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
