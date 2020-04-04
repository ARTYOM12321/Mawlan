const express = require('express');

const Router = express.Router({
  mergeParams: true
});

const newController = require('../controllers/carsController');
const authController = require('../controllers/aythController');

Router.route('/l').get(newController.SearchMovies); //http://127.0.0.1:3000/cars/l?search=a

/*    authController.protect,
    authController.restrictTo('admin'), */
Router.route('/')
  .get(authController.isLoggedIn, newController.getAllCars) //getAllCars
  .post(
    //   authController.protect,
    //   authController.restrictTo('admin'),
    authController.isLoggedIn,
    newController.uploadImages,
    newController.resizePhotos,
    newController.CreateCar
  );

Router.route('/:id')
  .get(authController.isLoggedIn, newController.getCar)
  .patch(
    // authController.protect,
    // authController.restrictTo('admin'),
    authController.isLoggedIn,
    newController.uploadImages,
    newController.resizePhotos,
    newController.UpdateCar
  )
  .delete(
    // authController.protect,
    // authController.restrictTo('admin'),
    authController.isLoggedIn,
    newController.DeleteCar
  );

module.exports = Router;
