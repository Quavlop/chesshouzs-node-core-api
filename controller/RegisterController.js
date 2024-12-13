const env = require('dotenv').config({path : '../../server/.env'});

const { v4 : uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomToken = require('random-token');

const db = require('../database/data/db');
const mailConfig  = require('../mailer/mailConfig');


const handleRegister = async (req, res, next) => {

    let {username = '', email = '', password = ''} = req.body;
    const validationErrorList = {};

    // username
    if (username == ''){
        // check empty username
        validationErrorList.USERNAME = {error : "EMPTY_USERNAME", message : "Username should not be empty"};
    } else {
        // check if username is reserved in database
        const findUsername = await db.select('*').from('users')
            .where('username', username)
            .first(); 

        if (findUsername){
            validationErrorList.USERNAME = {error : "UNAVAILABLE_USERNAME", message : "Username is unavailable"};
        }
    }

    // email
    if (email == ''){
        // check empty email
        validationErrorList.EMAIL = {error : "EMPTY_EMAIL", message : "Email should not be empty"};
    } else {
        // check email pattern 
        email = email.toLowerCase();
        const emailPattern = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
        if (!emailPattern.test(email)) {
            validationErrorList.EMAIL = {error : "INVALID_EMAIL", message : "Invalid email format"};
        } else {
        // check if email is reserved in database            
            const findEmail = await db.select('*').from('users')
            .where('email', email)
            .first();         

            if (findEmail){
                validationErrorList.EMAIL = {error : "UNAVAILABLE_EMAIL", message : "Email has been registered"};
            }
        }
    }

    // password
    if (password.length < 8){
        // check password length
        validationErrorList.PASSWORD = {error : "INVALID_PASSWORD", message : "Password length must be greater than 8 character."};
    } 


    // Pre-flight before email verification
    if (Object.keys(validationErrorList).length !== 0){
        return res.status(400).json({
            status : "FAIL",
            code : 400,
            message : "Invalid inputs",
            errors : validationErrorList
        });
    } 


    const hashedPassword = await bcrypt.hash(password, 10);


    const userData = {id : uuid(), username, email, password : hashedPassword}

    const account = await db('users').insert(userData)
        .catch((err) => {
            return res.status(500).json({
                status : 'FAIL',
                code : 500,
                error : "SERVER_ERROR",                                                    
                message : 'Internal server error',
                detail : err
            })
        });

    jwt.sign({id : userData.id, elo_points : 0}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_LIFETIME / 24 + 'd'},
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
                sameSite : process.env.ENVIRONMENT === "production" ? "None" : "Lax",
                maxAge : 3600000 * process.env.JWT_LIFETIME,
                secure : process.env.ENVIRONMENT === "production",
            });            
        }
    );    

    let filteredAccountDetails = userData;

    // insert email token verification into database     
    const token = randomToken(48);

    const createToken = await db('email_verification_tokens').insert({
        user_id : userData.id,
        token, 
        expires_at :  new Date(new Date().getTime() + (process.env.EMAIL_TOKEN_EXPIRATION * 60 * 1000)) // env_config * 1 minute
    });


    mailConfig.sendMail({
        from : process.env.MAIL_ACCOUNT,
        to : userData.email, 
        subject : "Verify your Email Address",
        html : 
        `<h1>ChessHouzs - Email Confirmation</h1>
        <h2>Hello, ${userData.username}</h2>
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
            message : "Successfully created account",
            account : filteredAccountDetails
        });                
    })    

}




module.exports = handleRegister;