const isPremium = (err, req, res, next) => {

    if (!req.userAcc.is_premium) {
        return res.status(401).json({
            status : 'FAIL', 
            code : 401, 
            message : 'Unauthorized (only premium user can access this resource).'
        });
    }

    next();

}



module.exports = isPremium;