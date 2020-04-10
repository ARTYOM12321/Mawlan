const axios = require('axios').default;
const bcrypt = require('bcryptjs');
const factory = require('./HandlerFactory');
const garage = require('.//..//Models//garageModel');
const User = require('../Models/UserModel');
const AppError = require('../utils/error');
const catchAsync = require('../utils/CatchAsync');

//----------------------------------------------------------------
//----------------------------------------------------------------

exports.getAllGarage = factory.getAll(garage);
exports.getGarage = factory.getOne(garage);
exports.CreateGarage = factory.CreateOne(garage);
exports.UpdateGarage = factory.UpdateOne(garage);
exports.DeleteGarage = factory.deleteOne(garage);
exports.SearchGarage = factory.PartialSearch(garage);

exports.setUserEmail = catchAsync(async (req, res, next) => {
  if (req.body.ownerEmail) {
    const userfound = await User.find({ Email: req.body.ownerEmail });
    let workers = [];

    if (userfound) {
      req.body.ownerUserId = userfound[0].id;

      if (req.body.workerEmail.length !== 0) {
        for (const file of req.body.workerEmail) {
          const workerfound = await User.find({ Email: file });
          workers.push(workerfound[0].id);
        }
      }

      req.body.worker = workers;
    }
  } else {
    return next(new AppError('Cannot find Owner email!', 403));
  }

  next();
});

exports.UpdateCheker = catchAsync(async (req, res, next) => {
  const garagefound = await garage.find({ _id: req.params.id });
  if (garagefound.length === 0)
    return next(new AppError('Garage Not Found!', 403));
  const users = garagefound[0].worker;

  if (users.length === 0 && !req.body.workerEmail)
    return next(new AppError('Couldnt fetch Users!', 403));

  const EmailArray = [];
  users.forEach(el => {
    EmailArray.push(el._id);
  });
  req.WorkerEmailsReq = [...EmailArray];
  EmailArray.push(garagefound[0].ownerUserId._id);

  //sending it to next Middleware

  //ONLY FOR ADMIN , CHANGING Published and IsGarage

  if (req.body.published == true || req.body.published == false) {
    if (req.UserDetails.role === 'admin') {
      for (const file of EmailArray) {
        await axios
          .patch(
            `https://carappdev.herokuapp.com/api/users/${file}`,
            {
              isGarage: req.body.published
            },
            {
              headers: {
                authorization: `Bearer ${req.cookies.jwt}` // change it to Headers later
              }
            }
          )
          .catch(err => {});
      }
    } else {
      req.body.published = undefined;
    }
  }

  next();
});

exports.UpdateWorker = catchAsync(async (req, res, next) => {
  if (req.body.workerEmail) {
    if (req.body.workerEmail.startsWith('-')) {
      //PREPARING FOR DELETE
      const email = req.body.workerEmail.split(' ')[1];

      const userfound = await User.find({ Email: email });

      if (userfound.length === 0)
        return next(new AppError('No user found with this email', 403));

      //USER FOUND ,Lets Check if He is in the WorkList Or Not

      if (!req.WorkerEmailsReq.toString().includes(userfound[0]._id))
        return next(
          new AppError('Provided email is not in the workers list', 403)
        );
      const indextodelete = req.WorkerEmailsReq.indexOf(userfound[0].id);
      req.WorkerEmailsReq.splice(indextodelete, 1);
      req.body.worker = [...req.WorkerEmailsReq];
    } else {
      //PREPARING FOR ADD
      const userfound = await User.find({ Email: req.body.workerEmail });

      if (userfound.length === 0)
        return next(new AppError('No user found with this email', 403));

      if (req.WorkerEmailsReq.toString().includes(userfound[0].id))
        return next(new AppError('User exists, Cannot add it again', 403));
      req.WorkerEmailsReq.push(userfound[0].id);
      req.body.worker = [...req.WorkerEmailsReq];
    }
  }

  next();
});

const cars = require('.//..//Models//carsModel');

exports.deleteChecker = catchAsync(async (req, res, next) => {
  const garagefound = await garage.findById(req.params.id);

  if (!garagefound) next(new AppError('Garage not Found!', 400));

  await cars.updateMany(
    { garageId: garagefound.id },
    {
      available: false
    }
  );

  next();
});
