const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); 


const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ message: 'Access Denied: No Token Provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Access Denied: Invalid Token' });
        }
        req.user = user; 
        next(); 
    });
};

module.exports = authenticateToken;
