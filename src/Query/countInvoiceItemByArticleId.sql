SELECT
	COUNT(id) AS TotalInvoiceItems
FROM
	invoiceItems
WHERE
	articleId = @id
