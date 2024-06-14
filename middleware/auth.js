const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    s
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
        req.user = await User.findById({_id:decoded.id}).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
