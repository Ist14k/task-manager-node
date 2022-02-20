const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/userModel');

const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token });

        if (!user) throw new Error();

        req.token = token;
        req.user = user;

        next();
    } catch (err) {
        res.status(401).send({ error: 'Please login to get access!' });
    }
};

module.exports = auth;
