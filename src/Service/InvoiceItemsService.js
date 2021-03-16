import connectionService from './ConnectionService';
import queryService from './QueryService';
import taxCalculation from '../Helper/TaxCalculation';
import logger from '../LoggerData/Logger';

class InvoiceItemsService {
    async insertInvoiceItems(
        articleId,
        quantity,
        unitPrice,
        totalWithTax,
        totalWithoutTax,
        totalTax,
        tax,
        taxName,
        description,
        invoiceId,
        userId){
        let connection;
        let invoiceTotalWithTax = 0, invoiceTotalWithoutTax = 0, invoiceTotalTax = 0;

        try {
            connection = await connectionService.pool.getConnectionAsync();
            connection.beginTransactionAsync();

            const insertInvoiceItemsQuery = queryService.queries.insertInvoiceItems;
            const unitPriceByArticleIdQuery = queryService.queries.getPriceByArticleId;
            const updateInvocePriceQuery = queryService.queries.updateInvoiceTotalPriceByInvoiceId;
            const getInvoceTotalQuery = queryService.queries.getInvoiceTotalByInvoiceId;

            const articlePrice = await connection.queryAsync(unitPriceByArticleIdQuery, {
                articleId,
            });

            //#region  CALCULATE INVOICE TAX AND PRICES

            unitPrice = articlePrice[0].price;
            totalWithTax = taxCalculation.totalWithTax(quantity, unitPrice);
            totalTax = taxCalculation.calculateTax(totalWithTax, tax);
            totalWithoutTax = totalWithTax - totalTax;

            //#endregion

            await connection.queryAsync(insertInvoiceItemsQuery, {
                articleId,
                quantity,
                unitPrice,
                totalWithTax,
                totalWithoutTax,
                totalTax,
                tax,
                taxName,
                description,
                invoiceId,
                userId,
            });

            const totalInvoice = await connection.queryAsync(getInvoceTotalQuery, {
                invoiceId,
            });

            //#region  SUM TOTAL INVOCE PRICES

            invoiceTotalWithTax = totalInvoice[0].totalWithTax;
            invoiceTotalWithoutTax = totalInvoice[0].totalWithoutTax;
            invoiceTotalTax = totalInvoice[0].totalTax;

            totalWithTax += invoiceTotalWithTax;
            totalWithoutTax += invoiceTotalWithoutTax;
            totalTax += invoiceTotalTax;

            //#endregion

            await connection.queryAsync(updateInvocePriceQuery, {
                invoiceId,
                totalWithTax,
                totalWithoutTax,
                totalTax
            });

            connection.commit();

            return {
                isSuccess: true,
            };
        } catch(error) {
            logger.error(`Insert invoice item method ${error.message}`);
            return error;
        } finally {
            if(connection) {
                connection.release();
            }
        }
    }

    async updateInvoiceItems(
        id,
        articleId,
        quantity,
        description,
        priceWithTax,
        priceWithoutTax,
        priceTax,
        tax,
        userId) {
        let connection;
        let totalWithTax = 0, totalWithoutTax = 0, totalTax = 0, unitPrice = 0, invoiceId = 0;
        let invoicePriceWithTax = 0, invoicePriceWithoutTax = 0, invoicePriceTax = 0;
        let itemsPriceWithTax = 0, itemsPriceWithoutTax = 0, itemsPriceTax = 0;

        try {
            connection = await connectionService.pool.getConnectionAsync();
            connection.beginTransactionAsync();
            
            const getPriceByArticleIdQuery = queryService.queries.getPriceByArticleId;
            const getInvoiceItemsTotalQuery = queryService.queries.getInvoiceItemTotalsByInvoiceItemId;
            const getInvoiceIdQuery = queryService.queries.getInvoiceIdByInvoiceItems;
            const invoiceTotalByInvoiceIdQuery = queryService.queries.getInvoiceTotalByInvoiceId;
            const updateInvoiceItemQuery = queryService.queries.updateInvoiceItems;
            const updateTotalByInvoiceIdQuery = queryService.queries.updateTotalPricesByInvoceId;

            // GET UPDATED ARTICLE INVOICE ITEM PRICES (MODIFIED PRICES FOR DB)
            const articlePriceResult = await connection.queryAsync(getPriceByArticleIdQuery, {
                articleId,
            });

            unitPrice = articlePriceResult[0].price;
            priceWithTax = taxCalculation.totalWithTax(quantity, unitPrice);
            priceTax = taxCalculation.calculateTax(priceWithTax, tax);
            priceWithoutTax = priceWithTax - priceTax;
           //

           // GET CURRENT TOTAL INVOICE ITEM PRICE BY invoiceItemId
            const invoiceItemsTotals = await connection.queryAsync(getInvoiceItemsTotalQuery, {
                id,
            });

            itemsPriceWithTax = invoiceItemsTotals[0].totalWithTax;
            itemsPriceWithoutTax = invoiceItemsTotals[0].totalWithoutTax;
            itemsPriceTax = invoiceItemsTotals[0].totalTax;
            //

            // GET INVOICE TOTAL FROM DB
            const invoiceIdResult = await connection.queryAsync(getInvoiceIdQuery, {
                id,
            });

            invoiceId = invoiceIdResult[0].invoiceId;

            const invoiceDbTotal = await connection.queryAsync(invoiceTotalByInvoiceIdQuery, {
                invoiceId,
            });

            invoicePriceWithTax = invoiceDbTotal[0].totalWithTax;
            invoicePriceWithoutTax = invoiceDbTotal[0].totalWithoutTax;
            invoicePriceTax = invoiceDbTotal[0].totalTax;
            //

            // Subtracting the value of the invoice item from the total value of the invoice
             totalWithTax = invoicePriceWithTax - itemsPriceWithTax;
             totalWithoutTax = invoicePriceWithoutTax - itemsPriceWithoutTax;
             totalTax = invoicePriceTax - itemsPriceTax;
            //

            // Change the current value of the invoice less the modified item 
            await connection.queryAsync(updateTotalByInvoiceIdQuery, {
                invoiceId,
                totalWithTax,
                totalWithoutTax,
                totalTax,
            });
            //
           
            // Update invoice item
            await connection.queryAsync(updateInvoiceItemQuery, {
                id,
                articleId,
                quantity,
                description,
                priceWithTax,
                priceWithoutTax,
                priceTax,
                tax,
                userId,
            });
            //

            // Adding modified invoice items values on invoice
            const temporaryInvoiceDbTotal = await connection.queryAsync(invoiceTotalByInvoiceIdQuery, {
                invoiceId,
            });

            invoicePriceWithTax = temporaryInvoiceDbTotal[0].totalWithTax;
            invoicePriceWithoutTax = temporaryInvoiceDbTotal[0].totalWithoutTax;
            invoicePriceTax = temporaryInvoiceDbTotal[0].totalTax;

            totalWithTax = invoicePriceWithTax + priceWithTax; 
            totalTax = taxCalculation.calculateTax(totalWithTax, tax);
            totalWithoutTax = totalWithTax - totalTax;
            //

            await connection.queryAsync(updateTotalByInvoiceIdQuery, {
                invoiceId,
                totalWithTax,
                totalWithoutTax,
                totalTax,
            });

            connection.commit();

            return {
                isSuccess: true,
            };
        } catch (error) {
            logger.error(`Update invoice item method ${error.message}`);
            return error;
        } finally {
            if(connection) {
                connection.release();
            }
        }
    }

    async deleteInvoiceItems(id) {
        let connection;
        let totalWithTaxInvoiceItem = 0, totalWithoutTaxInvoiceItem = 0, totalTaxInvoiceItem = 0;
        let totalWithTaxInvoice = 0, totalWithoutTaxInvoice = 0, totalTaxInvoice = 0;
        let totalWithTax = 0, totalWithoutTax = 0, totalTax = 0;

        try {
            connection = await connectionService.pool.getConnectionAsync();
            connection.beginTransactionAsync();

            const deleteInvoiceItemQuery = queryService.queries.deleteInvoiceItems;
            const getPriceByInvoiceItemQuery = queryService.queries.getTotalPriceByInvoiceItemsId;
            const getInvoceTotalQuery = queryService.queries.getInvoiceTotalByInvoiceId;
            const updateTotalPriceByInvoiceQuery = queryService.queries.updateInvoiceTotalPriceByInvoiceId;
            const getInvoiceIdQuery = queryService.queries.getInvoiceIdByInvoiceItems;

            const totalByInvoceItem = await connection.queryAsync(getPriceByInvoiceItemQuery, {
                id,
            });

            const InvoiceIdQueryResult = await connection.queryAsync(getInvoiceIdQuery, {
                id,
            });

            const invoiceId = InvoiceIdQueryResult[0].invoiceId;

            const totalByInvoice = await connection.queryAsync(getInvoceTotalQuery, {
                invoiceId,
            });

            //#region  REMOVE INVOICE ITEMS CALCULATION
            totalWithTaxInvoiceItem = totalByInvoceItem[0].totalWithTax;
            totalWithoutTaxInvoiceItem = totalByInvoceItem[0].totalWithoutTax;
            totalTaxInvoiceItem = totalByInvoceItem[0].totalTax;

            totalWithTaxInvoice = totalByInvoice[0].totalWithTax;
            totalWithoutTaxInvoice = totalByInvoice[0].totalWithoutTax;
            totalTaxInvoice = totalByInvoice[0].totalTax;

            totalWithTax = totalWithTaxInvoice - totalWithTaxInvoiceItem;
            totalWithoutTax = totalWithoutTaxInvoice - totalWithoutTaxInvoiceItem;
            totalTax = totalTaxInvoice - totalTaxInvoiceItem;
            //#endregion

            await connection.queryAsync(updateTotalPriceByInvoiceQuery, {
                invoiceId,
                totalWithTax,
                totalWithoutTax,
                totalTax
            });

            await connection.queryAsync(deleteInvoiceItemQuery, {
                id,
            });
            
            connection.commit();

            return {
                isSuccess: true,
            };
        } catch (error) {
            logger.error(`Delete invoice item method ${error.message}`);
            return error;
        } finally {
            if(connection) {
                connection.release();
            }
        }
    }
}

export default new InvoiceItemsService();
