import express from 'express';
import articleController from '../Controller/ArticleController';
import protectRoutes from '../Middleware/ProtectRoutesMiddleware';
import validationMiddleware from '../Middleware/ValidationMiddleware';

const articleRouter = express.Router();

articleRouter.post(
'/',
protectRoutes.protectRoutes,
validationMiddleware.articleData,
articleController.postArticle);

articleRouter.put('/:id', protectRoutes.protectRoutes, articleController.putArticle);

articleRouter.delete('/:id', protectRoutes.protectRoutes, articleController.deleteArticle);

export default articleRouter;
