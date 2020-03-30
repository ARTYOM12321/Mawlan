const express = require('express');

const Router = express.Router({
  mergeParams: true
});

const newController = require('../controllers/gerageController');
//const authController = require('../../controllers/aythController');

Router.route('/l').get(newController.SearchGarage); //http://127.0.0.1:3000/garage/l?search=a

/*    authController.protect,
    authController.restrictTo('admin'),*/
Router.route('/')
  .get(newController.getAllGarage)
  .post(
    //   authController.protect,
    //   authController.restrictTo('admin'),
    //   newController.uploadNewsImages,
    //    newController.resizeNewsPhotos,
    newController.CreateGarage
  );

Router.route('/:id')
  .get(newController.getGarage)
  .patch(
    // authController.protect,
    // authController.restrictTo('admin'),
    // newController.uploadNewsImages,
    // newController.resizeNewsPhotos,
    newController.UpdateGarage
  )
  .delete(
    // authController.protect,
    // authController.restrictTo('admin'),
    newController.DeleteGarage
  );

module.exports = Router;
