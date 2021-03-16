import connectionService from './ConnectionService';
import queryService from './QueryService';
import bCrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import logger from '../LoggerData/Logger';

class UserService {

    async postUser(firstName, lastName, email, password) {
        let connection;
        const saltRounds = 10;

        try {
            connection = await connectionService.pool.getConnectionAsync();
            const dbQuery = queryService.queries.insertUser;

            bCrypt.genSalt(saltRounds, (err, salt) => {
               if(err) return err;
                bCrypt.hash(password, salt, (err, hash) => {
                    if (err) return err;

                    password = hash;
                    connection.queryAsync(dbQuery, {
                        firstName,
                        lastName,
                        email,
                        password,
                    });
                });

                return 'You successfully created new user';
           });
        } catch (error) {
            logger.error(`Insert user method ${error.message}`);
            return error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    }

    async login(email, password) {
        let connection;

        try {
            connection = await connectionService.pool.getConnectionAsync();
            const dbQuery = queryService.queries.getUserById;
            const dbQueryResult = await connection.queryAsync(dbQuery, {
                email,
            });

            const userPassword = dbQueryResult[0].password;
            const checkPassword = await bCrypt.compare(password, userPassword);

            if(checkPassword) {
                const userId = dbQueryResult[0].id;
                const token = jwt.sign({ id: userId }, config.secretJWTKey, { expiresIn: '1h' });

                return token;
            } else {
                return { isSuccess: false };
            }
        } catch (error) {
            logger.error(`Login user method ${error.message}`);
            return error;
        } finally {
            if(connection) {
                connection.release();
            }
        }
    }

    async changeUserPassword(password, newPassword, userId) {
        let connection;
        const saltRounds = 10;

        try {
            connection = await connectionService.pool.getConnectionAsync();
            connection.beginTransaction();

            const updateUserPasswordQuery = queryService.queries.changeUserPassword;
            const getUserPasswordQuery = queryService.queries.getUserPasswordByUserId;

            const userPasswordResult = await connection.queryAsync(getUserPasswordQuery, {
                userId,
            });

            const userPassword = userPasswordResult[0].password;
            
            if(password === newPassword) {
                return {
                    warningMessage: 'Current and new password are eaqule, try again'
                }
            }

            const checkPassword = await bCrypt.compare(password, userPassword);

            if(checkPassword == false) {
                return {
                    warningMessage: 'Current password is not correct',
                }
            } else {
                bCrypt.genSalt(saltRounds, (err, salt) => {
                    if(err) return err;
                    bCrypt.hash(newPassword, salt, (err, hash) => {
                        if(err) return err;

                        newPassword = hash
                        connection.queryAsync(updateUserPasswordQuery, {
                            newPassword,
                            userId,
                        });
                    })
                });

                connection.commit();

                return {
                    isSuccess: true,
                }
            }
        } catch (error) {
            logger.error(`Update user password method ${error.message}`);
            return error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    }
}

export default new UserService();
