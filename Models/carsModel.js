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
    carDescription: {
      type: String
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
      type: String
    },
    listOfImages: {
      type: Array
    },
    location: [String],
    PostOwner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user']
    },
    garageId: {
      type: mongoose.Schema.ObjectId,
      ref: 'garage'
    },
    individual: {
      type: Boolean,
      default: true
    },
    available: {
      type: Boolean,
      default: true
    },
    createdAt: Date
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
    select:
      '-__v -passwordChangedAt -PasswordResetToken -PasswordResetExpires -active -isGarage'
  });
  next();
});
/*
carsSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'garageId',
    select: '-__v -GeragePassword -ownerUserId -locations'
  });
  next();
});
*/
carsSchema.pre('save', async function(next) {
  this.createdAt = Date.now();
  next();
});
carsSchema.pre(/^find/, function(next) {
  this.find({ available: { $ne: false } });
  next();
});
const cars = mongoose.model('cars', carsSchema);
module.exports = cars;
