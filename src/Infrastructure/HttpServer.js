import express from 'express';
import bodyParser from 'body-parser';
import config from '../../config';
import userRouter from '../Routes/UserRouter';
import articleRouter from '../Routes/ArticleRouter';
import invoiceRouter from '../Routes/InvoiceRouter';
import invoiceItemsRouter from '../Routes/InvoiceItemsRouter';

class HttpServer {

    constructor (option = {}) {
        this.port = option.serverPort || config.serverPort;
        this.environment = option.environment || config.environment;
        this.app = express();
    }

    start(){
        this.register();
        this.app.listen(this.port, () =>{
            console.log(`Server started on port ${this.port} in ${this.environment} mode`)
        });
    }
    register(){
        this.app.use(bodyParser());
        this.app.get('/', (req, res) => {
            res.send('Http server is up ...');
        });
        this.app.use('/user', userRouter);
        this.app.use('/article', articleRouter);
        this.app.use('/invoice', invoiceRouter);
        this.app.use('/invoiceItems', invoiceItemsRouter);
    }
}

export default new HttpServer();
