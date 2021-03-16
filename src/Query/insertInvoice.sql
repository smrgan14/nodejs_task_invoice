INSERT
INTO
    invoice (number,createDate,deliveryDate,totalWithoutTax,totalWithTax,totalTax,userId,recipient)
VALUES
    (@number,@createDate,@deliveryDate,@totalWithoutTax,@totalWithTax,@totalTax,@userId,@recipient)
