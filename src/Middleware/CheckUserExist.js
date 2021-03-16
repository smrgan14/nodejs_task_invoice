import connectionService from '../Service/ConnectionService';
import queryService from '../Service/QueryService';

class UserCheck {
    async checkUser(req, res, next) {
        let connection;
        try {
            connection = await connectionService.pool.getConnectionAsync();
            const { email } = req.body;
            const dbQuery = queryService.queries.countUserByEmail;
            const dbResult = await connection.queryAsync(dbQuery, {
                email,
            });
            
            const countValue = dbResult[0].ExistEmail;

            if(countValue == 1) {
                res.status(400).send('This user email already exist!!! Please try again.');
            } else {
                next();
            }
            
        } catch (error) {
            return error;
        }
    }
}

export default new UserCheck();
