const validationHelper = require('../Helper/Validation');

const articleData = (req,res,next) => {
    const articleValidationRule = {
        'name': 'required|string',
        'price': 'required',
    };

    validationHelper(req.body, articleValidationRule, {}, (err,status)=> {
        if(!status){
            res.status(412)
        .send({
            success: false,
            message:'Article validation data field',
            data: err,
        });
    } else {
        next();
    } 
});
}

const userData = (req,res,next) => {
    const userValidationRule = {
        'firstName': 'required|string',
        'lastName': 'required|string',
        'email': 'required|email',
        'password': 'required|string|min:6'
    };

    validationHelper(req.body, userValidationRule, {}, (err,status)=> {
        if(!status){
            res.status(412)
        .send({
            success: false,
            message:'User validation data field',
            data: err,
        });
    } else {
        next();
    } 
});
}

const invoiceData = (req,res,next) => {
    const invoiceValidationRule = {
        'deliveryDate': 'required|date',
        'recipient': 'required|string',
    };

    validationHelper(req.body, invoiceValidationRule, {}, (err,status)=> {
        if(!status){
            res.status(412)
        .send({
            success: false,
            message:'Invoice validation data field',
            data: err,
        });
    } else {
        next();
    } 
});
}

const invoiceItemData = (req,res,next) => {
    const invoiceItemValidationRule = {
        'quantity': 'required|integer',
    };

    validationHelper(req.body, invoiceItemValidationRule, {}, (err,status)=> {
        if(!status){
            res.status(412)
        .send({
            success: false,
            message:'Invoice item validation data field',
            data: err,
        });
    } else {
        next();
    } 
});
}

module.exports = {
    articleData,
    userData,
    invoiceData,
    invoiceItemData,
}

