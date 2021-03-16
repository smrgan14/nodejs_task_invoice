import express from 'express';
import invoiceController from '../Controller/InvoiceController';
import protectRoutes from '../Middleware/ProtectRoutesMiddleware';
import validationMiddleware from '../Middleware/ValidationMiddleware';

const invoiceRouter = express.Router();

invoiceRouter.post(
    '/',
    protectRoutes.protectRoutes,
    validationMiddleware.invoiceData,
    invoiceController.insertInvoice);

invoiceRouter.put(
    '/:invoiceId',
    protectRoutes.protectRoutes,
    validationMiddleware.invoiceData,
    invoiceController.updateInvoice);

invoiceRouter.delete('/:invoiceId', protectRoutes.protectRoutes, invoiceController.deleteInvoice);

export default invoiceRouter;
