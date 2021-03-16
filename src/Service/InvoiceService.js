import connectionService from './ConnectionService';
import queryService from './QueryService';
import logger from '../LoggerData/Logger';

class InvoiceService {
    async insertInvoice(
        number,
        createDate,
        deliveryDate,
        totalWithoutTax,
        totalWithTax,
        totalTax,
        userId,
        recipient) {
            let connection;

            try {
                connection = await connectionService.pool.getConnectionAsync();
                connection.beginTransactionAsync();

                const dbQuery = queryService.queries.insertInvoice;
                const lastInvoiceNumberQuery = queryService.queries.getLastInvoiceNumber;

                const lastInvoiceNumber = await connection.queryAsync(lastInvoiceNumberQuery);
                (lastInvoiceNumber == '') ? number = 1 : number = lastInvoiceNumber[0].number + 1;

                await connection.queryAsync(dbQuery, {
                    number,
                    createDate,
                    deliveryDate,
                    totalWithoutTax,
                    totalWithTax,
                    totalTax,
                    userId,
                    recipient
                });

                connection.commit();

                return {
                    isSuccess: true,
                };

            } catch (error) {
                logger.error(`Insert invoice method ${error.message}`);

                return error;
            } finally {
                if(connection){
                    connection.release();
                }
            }
    }

    async updateInvoice(invoiceId, deliveryDate, recipient) {
        let connection;
        try {
            connection = await connectionService.pool.getConnectionAsync();
            const dbQuery = queryService.queries.updateInvoice;

            await connection.queryAsync(dbQuery, {
                invoiceId,
                deliveryDate,
                recipient,
            });

            return {
                isSuccess: true,
            };
        } catch (error) {
            logger.error(`Update invoice method ${error.message}`);
            return error;
        }
    }

    async deleteInvoice(invoiceId) {
        let connection;
        try {
            connection = await connectionService.pool.getConnectionAsync();
            const deleteInvoiceQuery = queryService.queries.deleteInvoice;

            await connection.queryAsync(deleteInvoiceQuery, {
                invoiceId,
            });

            connection.commit();

            return {
                isSuccess: true,
            };
        } catch (error) {
            logger.error(`Delete invoice method ${error.message}`);
            return error;
        } finally {
            if(connection) {
                connection.release();
            }
        }
    }
}

export default new InvoiceService();
