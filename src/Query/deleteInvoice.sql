DELETE
	invoiceItems, invoice
FROM
	invoiceItems
JOIN
	invoice ON invoiceItems.invoiceId = invoice.id
WHERE
	invoiceItems.invoiceId = @invoiceId
