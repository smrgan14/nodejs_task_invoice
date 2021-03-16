import invoiceService from '../Service/InvoiceService';
import moment from 'moment';

class InvoiceController {
    async insertInvoice(req, res) {
        try {
            const { deliveryDate, recipient } = req.body;
            const userId = req.decoded.id;
            let number = 0 ,totalWithTax = 0, totalTax = 0, totalWithoutTax = 0;
            let createDate = moment().format('YYYY-MM-DD HH:mm:ss');

            const invoiceData = await invoiceService.insertInvoice(
                number,
                createDate,
                deliveryDate,
                totalWithoutTax,
                totalWithTax,
                totalTax,
                userId,
                recipient
            );

            res.status(200).send(invoiceData);

        } catch (error) {
            res.status(400).send(error);
        }
    }

    async updateInvoice(req, res) {
        try {
            const { deliveryDate, recipient } = req.body;
            const { invoiceId } = req.params;

            const data = await invoiceService.updateInvoice(invoiceId, deliveryDate, recipient);

            res.status(200).send(data);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async deleteInvoice(req, res) {
        try {
            const { invoiceId } = req.params;
            const data = await invoiceService.deleteInvoice(invoiceId);

            res.status(200).send(data);
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default new InvoiceController();