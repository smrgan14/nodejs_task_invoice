import connectionService from './ConnectionService';
import queryservice from './QueryService';
import logger from '../LoggerData/Logger';

class ArticleService {
    async postArticle(name, price) {
        let connection;

        try {
            connection = await connectionService.pool.getConnectionAsync();
            const dbQuery = queryservice.queries.insertArticle;
            await connection.queryAsync(dbQuery, {
                name,
                price,
            });

            return {
                isSuccessfully: true
            };
        } catch (error) {
            logger.error(`Insert article method ${error.message}`);
            return error;
        } finally {
            if(connection) {
                connection.release();
            }    
        }
    }

    async putArticle(id, name, price) {
        let connection;
        let totalItemCount = 0;

        try {
            connection = await connectionService.pool.getConnectionAsync();
            connection.beginTransactionAsync();

            const countInvoiceItemsQuery = queryservice.queries.countInvoiceItemByArticleId;
            const dbQuery = queryservice.queries.updateArticle;

            const totalInvoiceItemResult = await connection.queryAsync(countInvoiceItemsQuery, {
                id,
            });

            totalItemCount = totalInvoiceItemResult[0].TotalInvoiceItems;

            if(totalItemCount >=1) {
                return {
                    warningMessage: 'You cannot modify the item! The item is on the invoice item.'
                }
            }
            
            await connection.queryAsync(dbQuery, {
                id,
                name,
                price,
            });

            connection.commit();
            return {
                isSuccess: true,
            };
        } catch (error) {
            logger.error(`Put article method ${error.message}`);
            return error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    }

    async deleteArticle(id) {
        let connection;
        try {
            connection = await connectionService.pool.getConnectionAsync();
            const dbQuery = queryservice.queries.deleteArticle;
            await connection.queryAsync(dbQuery, {
                id,
            });

            return {
                isSuccess: true
            };
        } catch (error) {
            logger.error(`Delete article method ${error.message}`);
            return error;
        } finally {
            if(connection) {
                connection.release();
            }
        }
    }
}

export default new ArticleService();
