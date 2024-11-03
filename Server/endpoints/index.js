const authController = require('./AUTH/authController');
const accountController = require('./accountController');
const feedController = require('./feedController');
const profileController = require('./profileController');
const followController = require('./followController');
const adminUsersController = require('./admin/userController');
const friendsController = require('./friendsController');
const postController = require('./postController');

module.exports = {
    authController,
    friendsController,
    accountController,
    feedController,
    profileController,
    followController,
    postController,
    adminUsersController,
}