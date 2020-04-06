const axios = require('axios').default;
const catchAsync = require('../utils/CatchAsync');
const factory = require('./HandlerFactory');
const cars = require('.//..//Models//carsModel');

//----------------------------------------------------------------
exports.test = catchAsync(async (req, res, next) => {
  await axios
    .get('http://127.0.0.1:3000/api/garage', {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlODYyNWJlNjFjMTY0MGQwMGEyYTRiZSIsImlhdCI6MTU4NTg0OTc5MSwiZXhwIjoxNTkzNjI1NzkxfQ.X9QKy35XXsahupOSPc3IDNa9tzkfq76axoLAi49oSao'
      }
    })
    .then(response => {
      console.log(response.data.user);
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
