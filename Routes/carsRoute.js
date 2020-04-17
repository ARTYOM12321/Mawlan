const express = require('express');

const Router = express.Router({
  mergeParams: true
});

const newController = require('../controllers/carsController');
const imageHandler = require('../controllers/imageHandler');

const authController = require('../controllers/aythController');

Router.route('/l').get(authController.protect, newController.SearchMovies); //http://127.0.0.1:3000/cars/l?search=a

/*    authController.protect,
    authController.restrictTo('admin'), */
Router.route('/')
  .get(
    authController.protect,
    //authController.isLoggedIn,
    newController.getAllCars
  ) //getAllCars
  .post(
    authController.protect,
    //   authController.restrictTo('admin'),

    // authController.isLoggedIn,
    //formidable(),

    imageHandler.uploadImages,
    newController.Check,
    imageHandler.resizePhotos('Cars'),
    newController.CreateCar
  );

Router.route('/:id')
  .get(authController.protect, newController.getCar)
  .patch(
    authController.protect,
    // authController.restrictTo('admin'),
    //authController.isLoggedIn,
    newController.CarsPermission,
    imageHandler.uploadImages,
    imageHandler.resizePhotos('Cars'),
    newController.UpdateCar
  )
  .delete(
    authController.protect,
    // authController.restrictTo('admin'),
    //authController.isLoggedIn,
    newController.CarsPermission,
    newController.DeleteCar
  );

module.exports = Router;
