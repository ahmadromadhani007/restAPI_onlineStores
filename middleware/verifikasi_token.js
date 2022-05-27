const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
        return res.status(401).json({
            status: 0,
            message: 'Token unauthorized'
        });
    }
    jwt.verify(authHeaders, "JWT HAS BEEN SUCCESSFULLY GENERATED", (err, decoded) => {
        if (err) {
            return res.status(400).json({
                status: 0,
                message: 'Token invalid',
                error : err.message
            })
        }
        req.id = decoded
        next();
    });
};