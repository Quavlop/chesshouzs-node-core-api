const env = require('dotenv').config({path : '../.env'})
const jwt = require('jsonwebtoken')

const handleLogOut = (req, res) => {
    const token = req.cookies?.__SESS_TOKEN || '';
    
    const tokenIsValid = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return res.status(401).json({
                status: 'FAIL',
                code: 401,
                message: 'Unauthenticated',
            });
        }


        const userId = data?.id || '';
        const jwtPayload = {id : userId};

        jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn : 1}, 
            (err, token) => {
                if (err) {
                    return res.status(500).json({
                        status : 'FAIL',
                        code : 500,
                        error : "SERVER_ERROR",                                
                        message : 'Internal server error',
                    })                    
                }

                res.cookie('__SESS_TOKEN', token, {
                    httpOnly : true,
                    sameSite : 'None',
                    maxAge : 1,
                    secure : process.env.ENVIRONMENT === "production",
                });                

                return res.status(200).json({
                    status : 'SUCCESS', 
                    code : 200, 
                    message : 'Successfully logged out.'
                });

            }
        
        )

    });
}


module.exports = handleLogOut;