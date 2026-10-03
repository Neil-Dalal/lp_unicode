const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { userId: decoded.userId }; 

        next();
    } catch (error) {
        next(error); 
    }
};

module.exports = verifyToken;