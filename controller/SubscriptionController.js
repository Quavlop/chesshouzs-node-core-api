const env = require('dotenv').config({path : "../.env"});
const { midtransCore, midtransSnap } = require('../lib/MidtransClient');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const db = require('../database/data/db');

const handleCheckout = async (req, res) => {

    try {
        const transactionTokenExchangeURL = process.env.MIDTRANS_TRANSACTION_TOKEN_URL;
        const serverKey = process.env.MIDTRANS_SERVER_KEY;

        const orderId = "PREMIUM-" + Date.now();

        const body = {
            "transaction_details": {
                "order_id" : orderId,
                "gross_amount": 10000
            },
            "credit_card":{
                "secure" : true
            },
            "item_details": [{
                "id": "CH-PREMIUM",
                "price": 10000,
                "quantity": 1,
                "name": "ChessHouzs Premium"
            }],            
            "customer_details": {
                "username" : req.userAcc.username,
                "email": req.userAcc.email,
            }
        }

        midtransSnap.createTransactionToken(body)
            .then(async token => { 

                const createOrder = await db('orders').insert({
                    id : orderId,
                    user_id : req.userAcc.id, 
                    description : 'ChessHouzs Premium'
                }).catch(er => {
                    return res.status(500).json({
                        code : 500, 
                        status : 'FAIL',
                        message : 'Internal server error.',
                    });                     
                })

                return res.status(200).json({
                    status : 'SUCCESS', 
                    code : 200, 
                    message : 'Transaction token exchanged successfully',
                    token, 
                });
            });

    } catch (err) {
        return res.status(500).json({
            code : 500, 
            status : 'FAIL',
            message : 'Internal server error.',
        }); 
    }
}

const checkPremium = async (req, res, next) => {

    try {

        const user = await db('users').where('id', req.userAcc.id).first();

        if (!user) throw new Error();
        
        if (!user.is_premium) {
            return res.status(401).json({
                status : 'FAIL', 
                code : 401, 
                message : 'Unauthorized (only premium user can access this resource).'
            });
        }
    
        return res.status(200).json({
            status : 'SUCCESS', 
            code : 200, 
            message : 'Resource successfully accessed.'
        });   

    } catch (err){
        return res.status(500).json({
            code : 500, 
            status : 'FAIL',
            message : 'Internal server error.',
        }); 
    }
 

}


module.exports = { handleCheckout, checkPremium }