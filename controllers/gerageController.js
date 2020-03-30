const catchAsync = require('../utils/CatchAsync');
const factory = require('./HandlerFactory');
const APIFeatures = require('./../utils/apiFeatures');
const garage = require('.//..//Models//garageModel');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

//----------------------------------------------------------------
//----------------------------------------------------------------

exports.getAllGarage = factory.getAll(garage);
exports.getGarage = factory.getOne(garage);
exports.CreateGarage = factory.CreateOne(garage);
exports.UpdateGarage = factory.UpdateOne(garage);
exports.DeleteGarage = factory.deleteOne(garage);

/*exports.getAll = catchAsync(async (req, res, next) => {
  let Posts;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    // Get all campgrounds from DB
    Posts = await Movies.find(
      {
        name: regex
      },
      { name: 1, slug: 1 }
    ).limit(10);
    /*  if (Posts.length === 0)
      return next(new AppError('Sorry No post has been found', 404)); //
  } else {
    var features = new APIFeatures(Movies.find(), req.query).filter();
    Posts = await features.query;
  }

  res.status(200).json({
    result: Posts.length,
    data: Posts
  });
});
*/
