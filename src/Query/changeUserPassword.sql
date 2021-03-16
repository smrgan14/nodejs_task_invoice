UPDATE
	user
SET
	password = @newPassword
WHERE
	id = @userId
