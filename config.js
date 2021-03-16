require('dotenv').config();

export default {
    serverPort: process.env.SERVER_PORT,
    environment: process.env.NODE_ENV,
    db: {
        database: process.env.DATABASE,
        user: process.env.USER,
        password: process.env.PASSWORD,
        port: process.env.PORT,
        host: process.env.HOST,
    },
    secretJWTKey: process.env.JWT_SECRET_KEY,
    bihTaxValue: process.env.BIH_TAX_VALUE,
    hrvTaxValue: process.env.HRV_TAX_VALUE,
    taxNameBiH: process.env.TAX_NAME_BIH,
    taxNameHRV: process.env.TAX_NAME_HRV,
}

