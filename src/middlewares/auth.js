const jwt = require("jsonwebtoken")
const userModel = require("../models/user");


async function auth(req, res, next) {
    try {
        let token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ error: "Authorization token missing" });
        }

        token = token.split(" ")[1];
        const verifyToken = await jwt.verify(token, "userToken");
        if (!verifyToken) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const user = await userModel.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

}
module.exports = auth;
