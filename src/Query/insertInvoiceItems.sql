INSERT
INTO
	invoiceItems (invoiceId,articleId,quantity,unitPrice,totalWithoutTax, totalWithTax, totalTax, tax, taxName, description, userId)
VALUES
	(@invoiceId,@articleId,@quantity,@unitPrice,@totalWithoutTax,@totalWithTax,@totalTax,@tax,@taxName,@description,@userId)
