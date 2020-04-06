const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    ownerUserId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      unique: true
    },
    GeragePassword: {
      type: String,
      maxlength: 6
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
garageSchema.index({ name: 1 });
garageSchema.pre('save', async function(next) {
  this.GeragePassword = await bcrypt.hash(this.GeragePassword, 6);
  next();
});

garageSchema.pre('save', async function(next) {
  this.createdAt = Date.now();
  next();
});

garageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'ownerUserId',
    select:
      '-__v -passwordChangedAt -PasswordResetToken -PasswordResetExpires -active -isGarage'
  });
  next();
});

garageSchema.methods.garagechecker = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const garage = mongoose.model('garage', garageSchema);
module.exports = garage;
