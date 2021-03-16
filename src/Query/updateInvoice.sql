UPDATE
    invoice
SET
    deliveryDate = @deliveryDate,
    recipient = @recipient
WHERE
    id = @invoiceId
