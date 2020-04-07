const axios = require('axios').default;
const factory = require('./HandlerFactory');
const garage = require('.//..//Models//garageModel');
const User = require('../Models/UserModel');
const AppError = require('../utils/error');

//----------------------------------------------------------------
//----------------------------------------------------------------

exports.getAllGarage = factory.getAll(garage);
exports.getGarage = factory.getOne(garage);
exports.CreateGarage = factory.CreateOne(garage);
exports.UpdateGarage = factory.UpdateOne(garage);
exports.DeleteGarage = factory.deleteOne(garage);
exports.SearchGarage = factory.PartialSearch(garage);

exports.setUserEmail = async (req, res, next) => {
  if (req.body.Email) {
    const userfound = await User.find({ Email: req.UserDetails.Email });

    if (userfound) {
      req.body.ownerUserId = userfound[0].id;
      await axios
        .patch(
          'http://127.0.0.1:3000/api/users/updateMe',
          {
            isGarage: true
          },
          {
            headers: {
              authorization: `Bearer ${req.cookies.jwt}`
            }
          }
        )
        .then(response => {})
        .catch(err => {});
    } else {
      return next(new AppError('Cannot find this email!', 403));
    }
  }
  next();
};
