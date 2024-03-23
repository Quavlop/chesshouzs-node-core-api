const env = require('dotenv').config({path : "../.env"});
const { midtransCore, midtransSnap } = require('../lib/MidtransClient');
const db = require('../database/data/db');
const { v4: uuidv4 } = require('uuid');

// DEFINED IN THE MIDTRANS DASHBOARD CONFIG YEEE
const paymentNotification = async (req, res) => {   

    const { body } = req;

    try {  

        if (body.transaction_status == 'pending'){
            const issueTransaction = await db('transactions').insert({
                id : uuidv4(),
                order_id : body.order_id, 
                status : body.transaction_status, 
                type : (
                    body.payment_type == 'bank_transfer' 
                        ? body.payment_type + '-VA-' +  body.va_numbers[0].bank + '-' + body.va_numbers[0].va_number
                        : body.payment_type

                ), 
                account_id : (body.payment_type == 'bank_transfer' && body.va_numbers[0].va_number), 
                amount : parseInt(body.gross_amount)
            }); 

            if (!issueTransaction) throw new Error();

            return res.status(201).json({
                code : 201, 
                status : 'SUCCESS',
                message : 'Payment is issued on pending status',
            });            

        } 

        if (body.transaction_status == 'settlement'){
            const update = await db('transactions')
                .where('order_id', body.order_id)
                .update({status : 'settlement'});            

            // if (!update) throw new Error();


            const issuer = await db('orders').where('id', body.order_id).first();
            if (!issuer) throw new Error();

            const userID = issuer.user_id;
            const updateSubscription = await db('users')
                                        .where('id', userID)
                                        .update({is_premium : true});

            // if (!updateSubscription) throw new Error();


            const deleteUserOrders = await db('transactions')
                                        .join('orders', 'transactions.order_id', '=', 'orders.id')            
                                        .where('orders.user_id', userID)
                                        .where('transactions.order_id', '!=', body.order_id)
                                        .where('orders.description', 'ChessHouzs Premium')
                                        .where('status', '!=', 'settlement')
                                        .delete();

            if (!deleteUserOrders) throw new Error();          

            return res.status(201).json({
                code : 201, 
                status : 'SUCCESS',
                message : 'Payment is issued on settlement status',
            });              
        }
        return res.status(200).json({
            code : 200, 
            status : 'TEST',
            message : 'Payment notification',
        }); 

    } catch  (err) {
        console.log(err);
        return res.status(500).json({
            code : 500, 
            status : 'FAIL',
            message : 'Internal server error.',
            detail : err.message
        });         
    }

}


module.exports = { paymentNotification }