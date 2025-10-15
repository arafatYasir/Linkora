const jwt = require("jsonwebtoken");

const jwtToken = (user, expire) => {
    return jwt.sign(user, process.env.SECRET, {expiresIn: expire})
}

module.exports = jwtToken