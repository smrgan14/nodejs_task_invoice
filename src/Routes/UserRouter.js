import userController from '../Controller/UserController';
import express from 'express';
import checkUserMiddleware from '../Middleware/CheckUserExist';
import protectRoutesMiddleware from '../Middleware/ProtectRoutesMiddleware';

const userRouter = express.Router();

userRouter.post('/', checkUserMiddleware.checkUser, userController.postUser);

userRouter.post('/login', userController.login);

userRouter.put(
    '/password/:userId',
    protectRoutesMiddleware.protectRoutes,
    userController.changeUserPassword);

export default userRouter;