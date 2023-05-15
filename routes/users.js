const usersRouter = require('express').Router();
const {
  getUsers, getUserId, updateUser, updateAvatar, getCurrentUserInfo,
} = require('../controllers/users');

const {
  userIdValidate,
  userInfoValidate,
  userAvatarValidate,
} = require('../middlewares/validate/userValidate');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', userIdValidate, getUserId);
usersRouter.get('/me', getCurrentUserInfo);
usersRouter.patch('/me', userInfoValidate, updateUser);
usersRouter.patch('/me/avatar', userAvatarValidate, updateAvatar);

module.exports = usersRouter;
