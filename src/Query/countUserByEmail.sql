SELECT
	COUNT(email) AS ExistEmail
FROM
	user
WHERE 
	email = @email

