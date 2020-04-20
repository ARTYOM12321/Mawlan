const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    postid: {
      type: mongoose.Schema.ObjectId,
      ref: 'cars',
      unique: true
    },
    createdAt: Date
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

favoriteSchema.index({ userid: 1 });
favoriteSchema.index({ postid: 1 });

favoriteSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'postid',
    select: 'name Price theModel listOfImages -PostOwner'
  });
  next();
});

favoriteSchema.pre('save', async function(next) {
  this.createdAt = Date.now();
  next();
});
const favorite = mongoose.model('favorite', favoriteSchema);
module.exports = favorite;
