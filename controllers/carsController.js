const catchAsync = require('../utils/CatchAsync');
const factory = require('./HandlerFactory');
const APIFeatures = require('./../utils/apiFeatures');
const cars = require('.//..//Models//carsModel');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

//----------------------------------------------------------------
//----------------------------------------------------------------

exports.getAllCars = factory.getAll(cars);
exports.getCar = factory.getOne(cars);
exports.CreateCar = factory.CreateOne(cars);
exports.UpdateCar = factory.UpdateOne(cars);
exports.DeleteCar = factory.deleteOne(cars);

exports.SearchMovies = catchAsync(async (req, res, next) => {
  let Posts;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    // Get all campgrounds from DB
    Posts = await cars
      .find(
        {
          name: regex
        },
        { name: 1, slug: 1 }
      )
      .limit(10);
    /*  if (Posts.length === 0)
      return next(new AppError('Sorry No post has been found', 404)); //*/
  } else {
    const features = new APIFeatures(cars.find(), req.query).filter();
    Posts = await features.query;
  }

  res.status(200).json({
    status: 'success',
    result: Posts.length,
    data: Posts
  });
});
