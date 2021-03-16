SELECT 
	totalWithoutTax, totalWithTax, totalTax
FROM
	invoiceItems
WHERE
	id = @id
