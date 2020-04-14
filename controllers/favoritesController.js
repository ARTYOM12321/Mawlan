const bcrypt = require('bcryptjs');
const axios = require('axios').default;
const catchAsync = require('../utils/CatchAsync');
const factory = require('./HandlerFactory');
const favs = require('.//..//Models//favoritesModel');
const AppError = require('../utils/error');

//exports.getAllfavs = factory.getAll(garage);
exports.getfavs = factory.getOne(favs);
exports.Createfavs = factory.CreateOne(favs);
exports.Updatefavs = factory.UpdateOne(favs);
exports.Deletefavs = factory.deleteOne(favs);

exports.setUserPostid = catchAsync(async (req, res, next) => {
  req.body.userid = req.UserDetails._id;

  next();
});

exports.getAllfavs = catchAsync(async (req, res, next) => {
  const doc = await favs.find({ userid: req.UserDetails._id });

  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: doc
  });
});
