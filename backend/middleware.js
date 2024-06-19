const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            msg: "Auth middleware error"
        });
    }

    
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if(!decoded){
            return res.status(403).json({
                msg: "Incorrect token"
            });
        }

        req.userId = decoded.userId;
        
        next();
    } catch (error) {
        return res.status(403).json({
            msg: `auth middleware catch ${error}`
        })
    }
}

module.exports = {
    authMiddleware,
}