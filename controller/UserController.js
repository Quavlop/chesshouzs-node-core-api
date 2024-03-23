// const env = require('dotenv').config({path : "../.env"});
const path = require('path')
const fs = require('fs');
const db = require('../database/data/db');

const editProfile = async (req, res) => {

    let { profile_picture } = req.body;
    const { username, email } = req.body;

    try {

        if (profile_picture){
            // User aren't uploading file (no changes to current PP)
            const update = await db('users')
                .where('id', req.userAcc.id)
                .update({username, email});

            if (!update) throw new Error();

            return res.status(200).json({
                status : "SUCCESS",
                code : 200, 
                message : "Successfully update profile."
            });
        } 

        if (profile_picture == ""){
            // No File, but want to delete profile picture (remove PP)
            const user = await db.select("*").from('users')
                .where('id', req.userAcc.id)
                .first();

            if (!user) throw new Error();
            
            if (user.profile_picture){
                fs.unlink('uploads' + user.profile_picture.slice(process.env.APP_URL.length), (err) => {
                    // Pake error handling karna biar bsa lgsgung rollback
                    if (err) {
                        return res.status(500).json({
                            status : 'FAIL',
                            code : 500,
                            error : "SERVER_ERROR",                                                    
                            message : 'Internal server error',
                        });                    
                    }                     
                });                
            }           

            const update = await db('users')
                .where('id', req.userAcc.id)
                .update({
                    username, 
                    email, 
                    profile_picture : null
                });            

            if (!update) throw new Error();
            
            return res.status(200).json({
                status : "SUCCESS",
                code : 200, 
                message : "Successfully update profile."
            });            


        }

    
        // User uploads file 
        profile_picture = req.file;    

        if (profile_picture){
            
            const allowedExtensions = ['.png', '.jpg', '.jpeg'];
            const extension = path.extname(profile_picture.originalname); 


            if (!allowedExtensions.includes(extension.toLowerCase())){

                fs.unlink(profile_picture.path, (err) => {
                    if (err) {
                        return res.status(500).json({
                            status : 'FAIL',
                            code : 500,
                            error : "SERVER_ERROR",                                                    
                            message : 'Internal server error',
                        });                                
                    }
                })

                return res.status(400).send({
                    code : 400,
                    status : 'FAIL', 
                    message : 'Invalid file extension (should be .png, .jpg, or .jpeg).'
                });                
            }

            const destination = profile_picture.destination;
            const imagePath = destination + profile_picture.filename + extension;
            
            fs.rename(profile_picture.path, imagePath, (err) => {
                if (err) { 
                    
                    fs.unlink(profile_picture.path, (err) => {
                        if (err) {
                            return res.status(500).json({
                                status : 'FAIL',
                                code : 500,
                                error : "SERVER_ERROR",                                                    
                                message : 'Internal server error',
                            });                                
                        }
                    })

                    return res.status(500).json({
                        status : 'FAIL',
                        code : 500,
                        error : "SERVER_ERROR",                                                    
                        message : 'Internal server error',
                    });                    
                }
            });


            const user = await db.select("*").from('users')
                .where('id', req.userAcc.id)
                .first();

            if (!user) throw new Error();
            
            if (user.profile_picture){
                // Gapake eror handling supaya foto ttp masuk (masalah lama kedelet apa engga urusan admin)
                fs.unlink('uploads' + user.profile_picture.slice(process.env.APP_URL.length), (err) => {});                
            }


            const update = await db('users')
                .where('id', req.userAcc.id)
                .update({
                    username, 
                    email, 
                    profile_picture : process.env.APP_URL + imagePath.slice("/uploads/".length).replace(/\\/g, '/')                    
                });            

            if (!update) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        return res.status(500).json({
                            status : 'FAIL',
                            code : 500,
                            error : "SERVER_ERROR",                                                    
                            message : 'Internal server error',
                        });                    
                    }                    
                });                  
            }
        
            return res.status(200).json({
                status : "SUCCESS",
                code : 200, 
                message : "Successfully update profile."
            });
        }


        throw new Error();



    } catch (err) {
        return res.status(500).json({
            status : 'FAIL',
            code : 500,
            error : "SERVER_ERROR",                                                    
            message : 'Internal server error',
        });
    }

}


module.exports = { editProfile }


