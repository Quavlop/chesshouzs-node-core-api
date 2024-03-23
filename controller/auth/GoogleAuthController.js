const env = require('dotenv').config({path : '../../.env'})
const { google : googleAPI, google } = require('googleapis');
const googleClient = require('../../lib/GoogleClient');
const authUrl = googleClient.generateAuthUrl({access_type : 'offline', scope : [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
]});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../database/data/db');
const { v4 : uuid } = require('uuid');


const getCallbackUrl = (req, res) => {
    return res.status(200).json({
        status : 'SUCCESS' ,
        code : 200,
        message : 'Successfully retrieved callback URL',
        url : authUrl
    });
};


const exchangeToken = async (req, res) => {
    const { code } = req.body;

    if (!code){
        return res.status(401).json({
            status : 'FAIL',
            code : 401,
            message : 'Unauthorized'
        });            
    }

    try {
        const { tokens }  = await googleClient.getToken(code);
        const { access_token } = tokens;

        googleClient.setCredentials({access_token});

        // googleClient.refreshAccessToken

        const googleUser = googleAPI.people({
            version : 'v1',
            auth : googleClient
        });

        const profile = await googleUser.people.get({
            resourceName : 'people/me',
            personFields : 'names,emailAddresses'
        });
        
        const userData = profile.data;

        if (!userData) throw new Error();

        const user = await db.select('*').from('users')
            .where('email', userData.emailAddresses[0].value)
            .first();

       // register
        if (!user){

            const identity = {
                id : uuid(),
                username : userData.names[0].displayName,
                email : userData.emailAddresses[0].value,
                google_id : userData.resourceName,
                email_verified_at : new Date()
            }      
                    
            const createUser = await db('users')
                .returning('id')
                .insert(identity);

            jwt.sign({id : identity.id, elo_points : 0}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_LIFETIME / 24 + 'd'}, 
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
                        maxAge : 3600000 * process.env.JWT_LIFETIME,
                        secure : true,
                    });   

                    return res.status(200).json({
                        status : "SUCCESS",
                        code : 200,
                        message : "Successfully created account",
                        account : identity
                    });                     
                    
                }
            );    
            
            return;
        }  
        
        

        // user exists but not registered via OAuth
        if (user?.password && !user.google_id){
            return res.status(409).json({
                status : 'FAIL',
                code : 409,
                error : "EXISTING_ACCOUNT",                                
                message : 'Email has been registered'
            })                               
        }



        // login
        if (!user.password && user?.google_id == userData.resourceName){
            jwt.sign({id : user.id , elo_points : user.elo_points}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_LIFETIME / 24 + 'd'}, 
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
                        maxAge : 3600000 * process.env.JWT_LIFETIME,
                        secure : true,
                    });   

                    return res.status(200).json({
                        status : "SUCCESS",
                        code : 200,
                        token, account : user
                    });                     
                    
                }
            );   
            return;          
        }        

 


        return res.status(404).json({
            status : 'FAIL',
            code : 404,
            message : "Unable to find your account"
        });   


    } catch (err){
        
        console.log(err);        
        return res.status(401).json({
            status : 'FAIL',
            code : 401,
            message : 'Unauthorized',
            error : err
        });         

    }
 


}


module.exports = {getCallbackUrl, exchangeToken};