const env = require('dotenv').config({path : '../../server/.env'});

const jwt = require('jsonwebtoken');
const randomToken = require('random-token');

const mailConfig  = require('../mailer/mailConfig');
const db = require('../database/data/db');


const verifyEmail = async (req, res, next) => {
    const { token } = req.params;

    const findToken = await db('email_verification_tokens')
        .returning('user_id')    
        .where('token', token)
        .where('expires_at', '>', new Date())
        .delete()
        .then(async (user) => {
            if (user.length <= 0){
                return res.status(401).json({
                    status : "FAIL",
                    code : 401, 
                    message : "Invalid token"
                })                   
            }

            const updateStatus = await db('users')
                .where('id', user[0].user_id)
                .update({
                    email_verified_at : new Date()
                }).then((result) => {
                    return res.status(200).json({
                        status : "SUCCESS",
                        code : 200,
                        message : "Successfully verified email",
                    });                      
                })
                .catch(err => {
                    throw new Error("Failed to verify email")
                });


        })
        .catch((err) => {
            return res.status(500).json({
                status : "FAIL",
                code : 500, 
                message : "Internal server error",
                error : err
            })
        });
}


const resendEmailVerification = async (req, res, next) => {

    const { id } = req.userAcc;

    const token = randomToken(48);

    const createToken = await db('email_verification_tokens').insert({
        user_id : id,
        token, 
        expires_at :  new Date(new Date().getTime() + (process.env.EMAIL_TOKEN_EXPIRATION * 60 * 1000)) // env_config * 1 minute
    });

    const findUser = await db.select('*').from('users')
        .where('id', id)
        .first()
        .then((data) => {
            if (!data){
                return res.status(401).json({
                    status : "FAIL",
                    code : 401,
                    error : "UNAUTHORIZED",                        
                    message : "Unauthorized"
                });                    
            }

            mailConfig.sendMail({
                from : process.env.MAIL_ACCOUNT,
                to : data.email, 
                subject : "Verify your Email Address",
                html : 
                `<h1>ChessHouzs - Email Confirmation</h1>
                <h2>Hello, ${data.username}</h2>
                <p>Thank you for registering! Please click the link below to verify your account and proceed.</p>
                <a href=${process.env.APP_URL}/auth/verify-email/${token}> Click here</a>
                </div>`        
            }, (err, info) => {
                if (err){
                    return res.status(500).json({
                        status : "FAIL",
                        code : 500, 
                        message : "Internal server error",
                        error : "Server are not ready to serve email transport for now",
                        detail : err
                    })
                }
        
                return res.status(200).json({
                    status : "SUCCESS",
                    code : 200,
                    message : "Successfully resend email verification link",
                });                
            })  

        }).catch((err) => {
            return res.status(500).json({
                status : "FAIL",
                code : 500, 
                message : "Internal server error",
                error : "Server are not ready to serve email transport for now",
                detail : err
            })            
        })
    
}

module.exports = {verifyEmail, resendEmailVerification}