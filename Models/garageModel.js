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
    location: String,
    ownerUserId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      unique: true
    },
    worker: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    published: {
      type: Boolean,
      default: false
    },
    GeragePassword: {
      type: String,
      maxlength: 6
    },
    createdAt: Date
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
garageSchema.index({ name: 1 });
garageSchema.pre('save', async function(next) {
  this.GeragePassword = await bcrypt.hash(this.GeragePassword, 12);
  next();
});
/*
garageSchema.pre(/^find/, function(next) {
  this.find({ published: { $ne: false } });
  next();
});
*/
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
garageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'worker',
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
/*
garageSchema.pre('save', async function(next) {
  if (!this.isModified('GeragePassword')) return next();

  this.GeragePassword = await bcrypt.hash(this.GeragePassword, 12);
  next();
}); 
*/
const garage = mongoose.model('garage', garageSchema);
module.exports = garage;
