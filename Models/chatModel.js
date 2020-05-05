const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    senderUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'You should have a account!']
    },
    userReciver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'There Must Be Someone To send message to!']
    },
    message: {
      type: String,
      trim: true,
      required: [true, 'there must be a message']
    },
    createdAt: Date
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

chatSchema.index({ message: 1 });
chatSchema.index({ userReciver: 1 });
chatSchema.index({ senderUser: 1 });

chatSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userReciver',
    select: 'name photo'
  });
  next();
});

chatSchema.pre('save', async function(next) {
  this.createdAt = Date.now();
  next();
});
const chat = mongoose.model('chat', chatSchema);
module.exports = chat;
