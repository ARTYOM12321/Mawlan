const express = require('express');

const Router = express.Router({
  mergeParams: true
});

const newController = require('../controllers/gerageController');
const authController = require('../controllers/aythController');
const imageHandler = require('../controllers/imageHandler');

Router.route('/l').get(authController.protect, newController.SearchGarage); //http://127.0.0.1:3000/garage/l?search=a

/*    authController.protect,
    authController.restrictTo('admin'),*/
Router.route('/')
  .get(authController.protect, newController.getAllGarage)
  .post(
    authController.protect,
    //   authController.restrictTo('admin'),
    // authController.isLoggedIn,
    imageHandler.uploadImages,
    imageHandler.resizePhotos('Garage'),
    newController.setUserEmail,
    newController.CreateGarage
  );

Router.route('/:id')
  .get(authController.protect, newController.getGarage)
  .patch(
    authController.protect,
    //authController.restrictTo('admin'),
    //authController.isLoggedIn,
    imageHandler.uploadImages,
    imageHandler.resizePhotos('Garage'),
    newController.UpdateCheker,
    newController.UpdateWorker,
    newController.UpdateGarage
  )
  .delete(
    //   authController.isLoggedIn,
    authController.protect,
    // authController.restrictTo('admin'),
    newController.deleteChecker,
    newController.DeleteGarage
  );

module.exports = Router;
