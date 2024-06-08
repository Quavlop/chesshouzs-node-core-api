const env = require('dotenv').config({path : '../../server/.env'});

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database/data/db');

const handleLogin = async (req, res) => {
    const { credential, password } = req.body;

    if (!credential || !password) {
        return res.status(401).json({
            status : "FAIL",
            code : 401,
            error : "INCORRECT_CREDENTIALS",
            message : "Incorrect credential and/or password"
        });
    }

    const user = await db.select('*').from('users')
        .where('email', credential)
        .orWhere('username', credential)
        .first()
            .then(async (data) => {
                if (!data){
                    return res.status(401).json({
                        status : "FAIL",
                        code : 401,
                        error : "INCORRECT_CREDENTIALS",                        
                        message : "Incorrect credential and/or password"
                    });                    
                }

                data.password = '';

                if (!await bcrypt.compare(password, data.password)){
                    return res.status(401).json({
                        status : "FAIL",
                        code : 401,
                        error : "INCORRECT_CREDENTIALS",                        
                        message : "Incorrect credential and/or password"
                    });                          
                }

                const jwtPayload = {id : data.id}

                jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn : process.env.JWT_LIFETIME / 24 + 'd'},
                    (err, token) => {
                        if (err){
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
                            maxAge : 3600000 * process.env.JWT_LIFETIME,
                            secure : true,
                        });

                        let filteredData = data;

                        return res.status(200).json({
                            status : 'SUCCESS',
                            code : 200,
                            token, data : filteredData
                        });                        
                    }
                )
            })
            .catch(err => {
                res.status(500).json({
                    status : 'FAIL',
                    code : 500,
                    error : "SERVER_ERROR",                                                    
                    message : 'Internal server error',
                })
            });

}

module.exports = handleLogin;