const env = require('dotenv').config({path : '../../.env'});
const jwt = require('jsonwebtoken');


const redirectIfRequestAuthenticated = (req, res, next) => {
    const token = req.cookies?.__SESS_TOKEN || '';
    
    const tokenIsValid = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return next();
        }

        return res.status(302).json({
            status: 'REDIRECT',
            code: 302,
            message: 'User is already authenticated',
        });

    });

}

module.exports = redirectIfRequestAuthenticated;


