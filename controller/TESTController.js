const testNest = (req, res) => {
    console.log(req.redis);
    return res.json({a : 1});
}


module.exports = { testNest }