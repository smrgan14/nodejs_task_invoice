UPDATE
    invoice
SET
    totalWithTax = @totalWithTax,
    totalWithoutTax = @totalWithoutTax,
    totalTax = @totalTax
WHERE
    id = @invoiceId
