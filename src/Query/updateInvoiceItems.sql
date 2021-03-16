UPDATE
    invoiceItems
SET
    articleId = @articleId,
    quantity = @quantity,
    description = @description,
    totalWithTax = @priceWithTax,
    totalWithoutTax = @priceWithoutTax,
    totalTax = @priceTax,
    tax = @tax,
    userId = @userId
WHERE
    id = @id
