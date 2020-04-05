const catchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/error');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('ببورە هیچ پەڕەیەك نەدۆزرایەوە', 404));
    }
    let userHolder = '';
    if (!res.locals.user) {
      res.locals.user = 'No user';
    }
    userHolder = { ...res.locals.user._doc };

    res.status(200).json({
      status: 'success',
      message: 'this data deleted',
      user: userHolder
    });
  });

exports.UpdateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('ببورە هیچ پەرەیەك نەدۆزرایەوە', 404));
    }

    let userHolder = '';
    if (!res.locals.user) {
      res.locals.user = 'No user';
    }
    userHolder = { ...res.locals.user._doc };

    res.status(200).json({
      status: 'success',
      data: doc,
      user: userHolder
    });
  });

exports.CreateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    let userHolder = '';
    if (!res.locals.user) {
      res.locals.user = 'No user';
    }
    userHolder = { ...res.locals.user._doc };

    res.status(201).json({
      status: 'success',
      data: doc,
      user: userHolder
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOptions !== {}) {
      query = query.populate(populateOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError('ببورە هیچ پەڕەیەك نەدۆزرایەوە', 404));
    }

    let userHolder = '';
    if (!res.locals.user) {
      res.locals.user = 'No user';
    }
    userHolder = { ...res.locals.user._doc };

    res.status(200).json({
      status: 'success',

      data: doc,
      user: userHolder
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    //to Allow for nested Get Reviews on tour(hack)
    let filter = {};
    if (req.params.tourId) filter = { _id: req.params.tourId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitField()
      .pagination();

    // const doc = await features.query.explain();
    const doc = await features.query; //find() gonna bring all data in database
    //200 === OK , we are sending a Json as Jsend

    let userHolder = '';
    if (!res.locals.user) {
      res.locals.user = 'No user';
    }

    userHolder = { ...res.locals.user._doc };
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
      user: userHolder
    });
  });

exports.SetSinglePhoto = (req, res, next) => {
  if (req.file) req.body.Photo = req.file.filename;

  next();
};
