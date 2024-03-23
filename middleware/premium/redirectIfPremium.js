const redirectIfPremium = (err, req, res, next) => {

    if (req.userAcc.is_premium) {
        return res.status(303).json({
            status : 'REDIRECT', 
            code : 303, 
            message : 'Premium user are not allowed to access this page.'
        });
    }

    next();

}



module.exports = redirectIfPremium;