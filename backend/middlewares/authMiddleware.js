const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        let temp = req.headers["Authorization"];
        const token = temp ? temp.split(" ")[1] : " ";

        // If no token found
        if(!token) {
            return res.status(404).json({
                error: "Token not found!"
            });
        }

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) {
                return res.status(400).json({
                    error: "Invalid token!"
                });
            }

            req.user = decoded;
            next();
        });

    } catch (e) {
        res.status(400).json({
            error: e.message
        })
    }
}

module.exports = authMiddleware;