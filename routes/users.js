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
usersRouter.get('/me', getCurrentUserInfo);
usersRouter.get('/:id', userIdValidate, getUserId);
usersRouter.patch('/me', userInfoValidate, updateUser);
usersRouter.patch('/me/avatar', userAvatarValidate, updateAvatar);

module.exports = usersRouter;
