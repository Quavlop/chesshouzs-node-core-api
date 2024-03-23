const env = require('dotenv').config({path : '../../.env'});
const jwt = require('jsonwebtoken');


const redirectIfAuthenticated = (req, res) => {
    const token = req.cookies?.__SESS_TOKEN || '';
    
    const tokenIsValid = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return res.status(200).json({
                status: 'SUCCESS',
                code: 200,
                message: 'Request successful',
            });
        }

        return res.status(302).json({
            status: 'REDIRECT',
            code: 302,
            message: 'User is already authenticated',
        });

    });

}

module.exports = redirectIfAuthenticated;


