import { createLogger, format, transports } from 'winston';

export default createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(error => `[${error.timestamp}] ${error.level} ${error.message}`)
    ),
    transports: [
        new transports.File({
        maxsize: 5120000,
        maxFiles: 5,
        filename: `${__dirname}/../../logs/log-error.log`,
    })
  ]
});