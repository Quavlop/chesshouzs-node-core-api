const checkCSRFToken = (err, req, res, next) => {

    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).json({
            status : 'FAIL',
            code : 403,
            error : 'INVALID_CSRF_TOKEN',
            message : "Invalid CSRF token"
        });        
    }

    return next(err);

}



module.exports = checkCSRFToken;