const mongoose = require('mongoose');

const carsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'There must be a name']
    },
    Price: {
      type: Number,
      required: [true, 'There must be a Price']
    },
    theModel: {
      type: Number,
      required: [true, 'There must be a Model Number']
    },
    plateType: {
      type: String,
      required: [true, 'there must be a plate']
    },
    carCompany: {
      type: String,
      required: [true, 'there must be a company Name']
    },
    destance: {
      type: Number
    },
    peston: {
      type: Number
    },
    carType: {
      type: String
    },
    fuelType: {
      type: String
    },
    gerType: {
      type: String
    },
    nameOfParts: {
      type: Array
    },
    listOfImages: {
      type: Array
    },
    location: {
      latitude: String,
      longitude: String
    },
    PostOwner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user']
    },
    garage: {
      type: mongoose.Schema.ObjectId
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
carsSchema.index({ name: 1 });

carsSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'PostOwner',
    select: '-__v'
  });
  next();
});

carsSchema.pre('save', async function(next) {
  this.createdAt = Date.now();
  next();
});

const cars = mongoose.model('cars', carsSchema);
module.exports = cars;
