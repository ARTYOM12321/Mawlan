const mongoose = require('mongoose');

const garageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'There must be a garage name']
    },
    listOfImages: {
      type: Array
    },
    locations: [
      {
        coordinates: [Number],
        address: String,
        description: String
      }
    ],
    owner: {
      type: mongoose.Schema.ObjectId
    },
    workers: {
      type: mongoose.Schema.ObjectId
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
garageSchema.index({ name: 1 });

garageSchema.pre('save', async function(next) {
  this.createdAt = Date.now();
  next();
});

const garage = mongoose.model('garage', garageSchema);
module.exports = garage;
