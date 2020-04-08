const bcrypt = require('bcryptjs');
const axios = require('axios').default;
const catchAsync = require('../utils/CatchAsync');
const factory = require('./HandlerFactory');
const cars = require('.//..//Models//carsModel');
const garage = require('.//..//Models//garageModel');
const AppError = require('../utils/error');

//----------------------------------------------------------------
exports.test = catchAsync(async (req, res, next) => {
  await axios
    .post('http://carappdev.herokuapp.com/api/users/login', {
      mawlan: 'user3442@microsoft.com',
      alipassword: 'test12345'
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
  res.status(200).json({
    'hello world': 'nothing'
  });
});
//----------------------------------------------------------------

exports.getAllCars = factory.getAll(cars);
exports.getCar = factory.getOne(cars);
exports.CreateCar = factory.CreateOne(cars);
exports.UpdateCar = factory.UpdateOne(cars);
exports.DeleteCar = factory.deleteOne(cars);
exports.SearchMovies = factory.PartialSearch(cars);
exports.CarsPermission = factory.UserPermission(cars);
exports.Check = async (req, res, next) => {
  if (req.UserDetails.isGarage && !req.body.individual) {
    const garagefound = await garage.find({ ownerUserId: req.UserDetails._id });

    const result = await bcrypt.compare(
      req.body.garagePassword,
      garagefound[0].GeragePassword
    );
    if (!result) {
      return next(new AppError('Garage Password is wrong!', 403));
    }
    req.body.garageId = garagefound[0].id;
  }

  next();
};
