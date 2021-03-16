import express from 'express';
import invoiceItemsController from '../Controller/InvoiceItemsController';
import protectRoutesMiddleware from '../Middleware/ProtectRoutesMiddleware';
import validationMiddleware from '../Middleware/ValidationMiddleware';

const invoiceItemsRouter = express.Router();


invoiceItemsRouter.post(
    '/:invoiceId/',
    protectRoutesMiddleware.protectRoutes,
    validationMiddleware.invoiceItemData,
    invoiceItemsController.insertInvoiceItems);

invoiceItemsRouter.put(
    '/:id',
    protectRoutesMiddleware.protectRoutes,
    validationMiddleware.invoiceItemData,
    invoiceItemsController.updateInvoiceItems);

invoiceItemsRouter.delete(
    '/:id',
    protectRoutesMiddleware.protectRoutes,
    invoiceItemsController.deleteInvoiceItems);

export default invoiceItemsRouter;
