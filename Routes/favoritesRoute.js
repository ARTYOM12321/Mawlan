const express = require('express');

const Router = express.Router({
  mergeParams: true
});

const newController = require('../controllers/favoritesController');
const authController = require('../controllers/aythController');

/*    authController.protect,
    authController.restrictTo('admin'),*/
Router.route('/')
  .get(
    //authController.protect
    authController.isLoggedIn,
    newController.setUserPostid,
    newController.getAllfavs
  )
  .post(
    // authController.protect,
    //   authController.restrictTo('admin'),
    authController.isLoggedIn,
    newController.setUserPostid,
    newController.Createfavs
  );

Router.route('/:id')
  .get(authController.protect, newController.getfavs)
  .delete(
    authController.isLoggedIn,
    // authController.protect,
    // authController.restrictTo('admin'),
    newController.Deletefavs
  );

module.exports = Router;
