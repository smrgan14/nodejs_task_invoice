SELECT 
	totalWithTax,totalWithoutTax,totalTax
FROM
	invoice
WHERE
	id = @invoiceId
