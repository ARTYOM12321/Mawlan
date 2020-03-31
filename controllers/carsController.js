const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/CatchAsync');
const AppError = require('./../utils/error');
const factory = require('./HandlerFactory');
const APIFeatures = require('./../utils/apiFeatures');
const cars = require('.//..//Models//carsModel');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

//----------------------------------------------------------------
//----------------------------------------------------------------
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'ئەمەی ئەپڵۆد كراوە وێنە نیە،تكایە تەنها وێنە ئەپڵۆد كە',
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadImages = upload.array('listOfImages', 10);
exports.resizePhotos = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.listOfImages = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `Cars-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .toFormat('jpeg')
        .jpeg()
        .toFile(`public/img/Cars/${filename}`);

      req.body.listOfImages.push(filename);
    })
  );

  next();
});

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
