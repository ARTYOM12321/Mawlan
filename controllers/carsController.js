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
  //check the properties
  console.log(req.body);
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log(req.body.individual);
  if (req.body.individual === 'true') {
    req.body.individual = true;
  }
  if (req.body.individual === 'false') {
    req.body.individual = false;
  }
  console.log('#######################################3');
  console.log(req.body.individual);
  console.log('#######################@@@@@@@@@@@@@@@@@@@@@');
  console.log(req.body.garagePassword);
  if (req.UserDetails.isGarage === true) {
    //looking for the garage in two queries
    let garagefound;
    garagefound = await garage.find({
      worker: req.UserDetails._id
    });
    if (garagefound.length === 0) {
      garagefound = await garage.find({
        ownerUserId: req.UserDetails._id
      });
    }
    if (garagefound.length === 0)
      return next(new AppError('No Gerage found for this user!', 403));

    //Now we have the result , lets check for the garage password
    console.log('Hi I Am HERE UP ');

    const result = await bcrypt.compare(
      req.body.garagePassword,
      garagefound[0].GeragePassword
    );
    console.log('Hi I Am HERE DOWN ');

    if (!result) {
      return next(new AppError('Garage Password is wrong!', 403));
    }
    //if everything is alright , then add this property to the Body
    req.body.garageId = garagefound[0].id;

    console.log('@#$@#$@#$');
    console.log(req.body.garageId);
  }

  next();
};
