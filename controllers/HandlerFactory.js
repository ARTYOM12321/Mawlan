const catchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/error');
const APIFeatures = require('./../utils/apiFeatures');
const garage = require('.//..//Models//garageModel');

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
    if (req.body.PostOwner) req.body.PostOwner = null;

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('ببورە هیچ پەرەیەك نەدۆزرایەوە', 404));
    }

    //CHANGING PASSWORDS
    if (req.body.GeragePasswordNew) {
      const user = await garage
        .findById(req.params.id)
        .select('+GeragePassword');
      if (!user) {
        return next(new AppError('There is no Gerage with that id ', 404));
      }
      user.GeragePassword = req.body.GeragePasswordNew;

      await user.save();
    }

    //////////////////////
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
    if (!req.body.PostOwner) req.body.PostOwner = req.UserDetails._id;

    const doc = await Model.create(req.body);
    const doc2 = await Model.findById(doc.id);
    let userHolder = '';
    if (!res.locals.user) {
      res.locals.user = 'No user';
    }
    userHolder = { ...res.locals.user._doc };

    res.status(201).json({
      status: 'success',
      data: doc2,
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
    if (req.user.role !== 'admin') req.query.published = true;
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

exports.PartialSearch = Model =>
  catchAsync(async (req, res, next) => {
    let limit = 6;
    if (req.query.rlimit) limit = req.query.rlimit * 1;
    let Posts;
    req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'gi');
      Posts = await Model.find(
        {
          name: regex
        },
        { name: 1, slug: 1 }
      ).limit(limit);
    } else {
      const features = new APIFeatures(Model.find(), req.query).filter();
      Posts = await features.query;
    }

    res.status(200).json({
      status: 'success',
      result: Posts.length,
      data: Posts
    });
  });

exports.UserPermission = Model =>
  catchAsync(async (req, res, next) => {
    if (!req.params.id) next(new AppError('wrong url', 403));

    const itemfound = await Model.find({ _id: req.params.id });

    if (!itemfound) next(new AppError('Not Found', 403));
    if (!req.UserDetails)
      next(new AppError('Please LogIn in order to do this action', 403));
    const user = req.UserDetails.id;
    if (user.localeCompare(itemfound[0].PostOwner._id) === 0) {
      next();
    } else {
      next(new AppError('You Dont Have Permission to do this Action!', 403));
    }
  });
