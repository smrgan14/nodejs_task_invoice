import httpServer from './Infrastructure/HttpServer';
import Promise from 'bluebird';

Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

httpServer.start();
