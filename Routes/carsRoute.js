const express = require('express');

const Router = express.Router({
  mergeParams: true
});

const newController = require('../controllers/carsController');
const authController = require('../controllers/aythController');

/*    authController.protect,
    authController.restrictTo('admin'),*/
Router.route('/')
  .get(newController.getAllCars)
  .post(
    //   authController.protect,
    //   authController.restrictTo('admin'),
    //   newController.uploadNewsImages,
    //    newController.resizeNewsPhotos,
    newController.CreateCar
  );

Router.route('/:id')
  .get(newController.getCar)
  .patch(
    // authController.protect,
    // authController.restrictTo('admin'),
    // newController.uploadNewsImages,
    // newController.resizeNewsPhotos,
    newController.UpdateCar
  )
  .delete(
    // authController.protect,
    // authController.restrictTo('admin'),
    newController.DeleteCar
  );

module.exports = Router;
