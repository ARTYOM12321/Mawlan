const express = require('express');

const Router = express.Router({
  mergeParams: true
});

const newController = require('../controllers/carsController');
const imageHandler = require('../controllers/imageHandler');

const authController = require('../controllers/aythController');

Router.route('/l').get(newController.SearchMovies); //http://127.0.0.1:3000/cars/l?search=a

/*    authController.protect,
    authController.restrictTo('admin'), */
Router.route('/')
  .get(
    // authController.protect,
    authController.isLoggedIn,
    newController.getAllCars
  ) //getAllCars
  .post(
    //   authController.protect,
    //   authController.restrictTo('admin'),

    authController.isLoggedIn,
    newController.Check,
    imageHandler.uploadImages,
    imageHandler.resizePhotos('Cars'),
    newController.CreateCar
  );

Router.route('/:id')
  .get(authController.isLoggedIn, newController.getCar)
  .patch(
    // authController.protect,
    // authController.restrictTo('admin'),
    authController.isLoggedIn,
    imageHandler.uploadImages,
    imageHandler.resizePhotos('Cars'),
    newController.UpdateCar
  )
  .delete(
    // authController.protect,
    // authController.restrictTo('admin'),
    authController.isLoggedIn,
    newController.DeleteCar
  );

module.exports = Router;
