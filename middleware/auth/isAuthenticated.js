const env = require('dotenv').config({path : '../../.env'});
const jwt = require('jsonwebtoken');


const isAuthenticated = (req, res, next) => {
    const token = req.cookies?.__SESS_TOKEN || '';
    if (token == '') {
        return res.status(401).json({
            status : 'FAIL',
            code : 401,
            error : "UNAUTHENTICATED",                                
            message : 'Unauthorized',
        })
    }

    const tokenIsValid = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return res.status(401).json({
                status : 'FAIL',
                code : 401,
                error : "UNAUTHENTICATED",                                
                message : 'Unauthorized',
            })  
        }
      
        req.userAcc = data;

        req.query.ingame = 1
        req.query.game_id = req.query.game_id;
        


        next();

    });

}

module.exports = isAuthenticated;


