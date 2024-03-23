const env = require('dotenv').config({path : '../../../server/.env'});
const jwt = require('jsonwebtoken');
const db = require('../../database/data/db');

// for front-end authentication

const authenticated = (req, res, next) => {
    const token = req.cookies?.__SESS_TOKEN || '';

    const { invalidGameID = false, room } = req;

    if (token == '') {
        next();
        return;
    }    

    const tokenIsValid = jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
        if (err) {
            return res.status(401).json({
                status : 'FAIL',
                code : 401,
                error : "UNAUTHENTICATED",                                
                message : 'Unauthorized',
            })  
        }


        const user = await db.select('*').from('users')
            .where('id', data.id)
            .first();



        if (!user){
            return res.status(401).json({
                status : 'FAIL',
                code : 401,
                error : "UNAUTHENTICATED",                                
                message : 'Unauthorized',
            })             
        }

        
        return res.status(200).json({
            status : 'SUCCESS',
            code : 200,
            message : "Authenticated",
            user, invalidGameID, room
        })

    });

}

module.exports = authenticated;