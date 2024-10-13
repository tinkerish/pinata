const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const err = new Error('Not authenticated');
        err.statusCode = 401;
        throw err;
    }

    const token = authHeader;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET|| 'your_secret_key'); // Use environment variable for the secret key
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const err = new Error('Not authenticated');
        err.statusCode = 401;
        throw err;
    }

    req.userId = decodedToken.userId;
    next();
};