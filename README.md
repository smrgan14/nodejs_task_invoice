READ ME
This is an example of an invoicing feature implemented in Node.js.
This feature allows you to create users, products that will be on account items, and just create invoices and items for created invoices.
An additional option is to calculate the tax according to the default values, so that on each invoice there is the price of the product with and without tax and the total amount of tax on that product.

POSTMAN ACTIONS
Remark:
Actions related to products, invoices and invoice items can only be realized if the user is logged in (JWT).

USER:
Register user:
Method	Url	Body
Post	localhost:5000/user/	{
    	"firstName": "User",
    	"lastName": "User",
    	"email": "user.user@live.com",
    	"password": "user.123"
}

Log In:
Method	Url	Body
Post	localhost:5000/user/login	{
    "email":" user.user@live.com ","password":" user.123" }


When a user logs in to the system, a token is obtained based on which we know which user it is.

The token received by the logged in user is used within the Header as an Authorization parameter.

Change user password:

Method	Url	Body
PUT	localhost:5000/user/password/:userId	{
    "password": "user.123",
    "newPassword": "user.1234"
}


Headers -> Authorization -> Token

ARTICLES (products):
Insert article:
Method	Url	Body
POST	localhost:5000/article/
	{
    "name":"Article 1",
    "price":2.00
}


Headers -> Authorization -> Token
Update article:
Method	Url	Body
PUT	localhost:5000/article/:id	{
    "name":"Article 5",
    "price": 7
}

Headers -> Authorization -> Token
Method	Url	Body
DELETE	localhost:5000/article/:id	

Headers -> Authorization -> Token

INVOICE:
Insert invoice:
Method	Url	Body
POST	localhost:5000/invoice	{
    "deliveryDate": "2021-01-10 00:00:00",
    "recipient": "Company"
}


Headers -> Authorization -> Token
Update invoice:
Method	Url	Body
PUT	localhost:5000/invoice/:id	{
    "deliveryDate": "2021-01-10 00:00:00",
    "recipient": "New company"
}


Headers -> Authorization -> Token

Delete invoice:
Method	Url	Body
DELETE	localhost:5000/invoice/:id	

Headers -> Authorization -> Token




INVOCE ITEMS:
Insert invoice item:
Method	Url	Body
POST	localhost:5000/invoiceItems/:invoiceId?taxName=BIH	{
    "articleId": 1,
    "quantity": 1,
    "description": "Description"
}


Headers -> Authorization -> Token
We declare Tax value in config.js where we use tax value from .env file.

Update invoice item:
Method	Url	Body
PUT	localhost:5000/invoiceItems/:Id?taxName=BIH	{
    "articleId": 3,
    "quantity": 2,
    "description": ""
}


Headers -> Authorization -> Token

Delete invoice item:
Method	Url	Body
DELETE	localhost:5000/invoiceItems/:id	

Headers -> Authorization -> Token

