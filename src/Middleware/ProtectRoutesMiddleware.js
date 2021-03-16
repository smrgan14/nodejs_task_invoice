import jwt from 'jsonwebtoken';
import config from '../../config';

class ProtectRoutesMiddleware {

    async protectRoutes(req, res, next) {
        try {
            const token = req.headers.authorization;
            if(token) {
                jwt.verify(token, config.secretJWTKey, (err, decoded) => {
                    if(err) {
                        return res.json({ message: 'Invalid Token' });
                    } else {
                        req.decoded = decoded;
                        next();
                    }
                });
            } else {
                res.send({ 
                  message: 'No provided token' 
                });
              }
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default new ProtectRoutesMiddleware();