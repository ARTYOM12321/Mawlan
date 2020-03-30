const Tour = require('.//..//Models//tourModel');
const catchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/error');
const factory = require('./HandlerFactory');

exports.alias = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};
exports.getAlltours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.postTour = factory.CreateOne(Tour);
exports.PatchTour = factory.UpdateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

//
//
//

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    /* ModelName.aggregate */
    {
      //to select || filter certain document
      //$StageName :{ fieldName: {$query}   }
      $match: { ratingsAverage: { $gte: 4.5 } }
    },

    {
      //allows to group together using accumulator(for calculating)
      $group: {
        //_id is Neccery: it's for what we group By(null for all)
        //toUpper is require another {} and it will change it to Capital
        _id: { $toUpper /* or $ne to exclude */: '$difficulty' },

        //number of tours { $sum : 1}, basically each time it run through this time line
        //it will be +1
        num: { $sum: 1 },

        //for calculating How much Ratings is there
        numofRatings: { $sum: '$ratingsQuantity' },

        //for Average of ratings
        //AnyName: {$avg(its mongoDB operator for avg) : '$fieldName'}
        avgRating: { $avg: '$ratingsAverage' },
        avgprice: { $avg: '$price' },

        //AnyName: {$min&max(its mongoDB operator for max||min num) : '$fieldName'}
        minPrice: { $min: '$price' },
        MaxPrice: { $max: '$price' }
      }
    },
    {
      //sort:which field we want to sort by ,
      //we should use Names at Group Stage , cause this is already happened by then
      $sort: { avgprice: 1 }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = async (req, res, next) => {};

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlang, unit } = req.params;
  const [lat, lang] = latlang.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lang) {
    next(
      new AppError(
        'please provide latitue and langtitue in the format in a format lke this lat,lang'
      ),
      400
    );
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lang, lat], radius] } }
  });
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlang, unit } = req.params;
  const [lat, lang] = latlang.split(',');

  const multiplier = unit === 'mi' ? 0.00006 : 0.001;
  if (!lat || !lang) {
    next(
      new AppError(
        'please provide latitue and langtitue in the format in a format lke this lat,lang'
      ),
      400
    );
  }

  const Distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinate: [lang * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: Distances
    }
  });
});
