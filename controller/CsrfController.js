const createCSRF = (req, res) => {

    try {
        return res.status(200).json({
            status : "SUCCESS",
            code : 200, 
            token : req.csrfToken()
        });
    } catch (err){
        return res.status(500).json({
            status : "FAIL",
            code : 500, 
            error : "SERVER_ERROR",
            message : "Internal server error"
        });
    }


}

module.exports = createCSRF;