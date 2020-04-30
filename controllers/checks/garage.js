/* eslint-disable */
const axios = require('axios').default;
const factory = require('./HandlerFactory');
const garage = require('.//..//Models//garageModel');
const User = require('../Models/UserModel');
const AppError = require('../utils/error');
const catchAsync = require('../utils/CatchAsync');

exports.EmailsChecker = catchAsync(async (req, res, next) => {
  if (req.body.worker.length > 0) {
    console.log(req.body.worker);
    const garagesFound = await garage.find({}, { ownerUserId: 1, worker: 1 });
    for (const email of req.body.worker) {
      for (const garages of req.body.worker) {
        if (email.toString().localeCompare(garages.ownerUserId._id) !== 0) {
          next(new AppError(`${email} is Owner from Another Garage`, 403));
        }
        garages.worker.forEach(el => {
          if (email.toString().localeCompare(garages.worker._id) !== 0) {
            next(new AppError(`${email} is Worker from Another Garage`, 403));
          }
        });
      }
    }
  }
  next();
});
