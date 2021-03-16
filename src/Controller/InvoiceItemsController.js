import invoiceItemsService from '../Service/InvoiceItemsService';
// import _ from 'lodash';
import config from '../../config';

class InvoiceItemsController {
    async insertInvoiceItems(req, res){
        try {
            const { articleId, quantity, description } = req.body;
            const { invoiceId } = req.params;
            const taxName  = req.query.taxName; 
            const userId = req.decoded.id;
            let tax = 0, unitePrice = 0, totalWithTax = 0, totalTax = 0, totalWithoutTax = 0;

            switch (taxName) {
                case 'BIH': 
                    tax = config.bihTaxValue;
                break;
                case 'HRV': 
                    tax = config.hrvTaxValue;
                break;
                default: 
                    tax = 0;
                break;
            }

            const data = await invoiceItemsService.insertInvoiceItems(
                articleId,
                quantity,
                unitePrice,
                totalWithTax,
                totalWithoutTax,
                totalTax,
                tax,
                taxName,
                description,
                invoiceId,
                userId,
            );

            res.status(200).send(data);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async updateInvoiceItems(req, res) {
        try {
            const { articleId, quantity, description } = req.body;
            const { id } = req.params;
            const taxName  = req.query.taxName; 
            const userId = req.decoded.id;
            let tax = 0, priceWithTax = 0, priceWithoutTax = 0, priceTax = 0;

            switch (taxName) {
                case 'BIH': 
                    tax = config.bihTaxValue;
                break;
                case 'HRV': 
                    tax = config.hrvTaxValue;
                break;
                default: 
                    tax = 0;
                break;
            }

            const data = await invoiceItemsService.updateInvoiceItems(
                id,
                articleId,
                quantity,
                description,
                priceWithTax,
                priceWithoutTax,
                priceTax,
                tax,
                userId,
            );

            res.status(200).send(data);

        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }

    async deleteInvoiceItems(req, res) {
        try {
            const { id } = req.params;
            const data = await invoiceItemsService.deleteInvoiceItems(id);

            res.status(200).send(data);
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default new InvoiceItemsController();
