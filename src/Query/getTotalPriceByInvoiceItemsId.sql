SELECT
	totalWithTax, totalWithoutTax, totalTax
FROM
	invoiceItems
WHERE
	id = @id

