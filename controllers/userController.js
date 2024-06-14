const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    const { name, email, mobile, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, mobile, password: bcrypt.hashSync(password, 8) });
        await user.save();
        const userResponse = { id: user._id, name: user.name, email: user.email, mobile: user.mobile };
        res.status(201).json(userResponse);
    } catch (err) {
        if (err.message.includes('E11000')) {
            // Handle duplicate key error (more specific message can be crafted here)
            res.status(400).json({ error: 'User already exists with this mobile number' });
        } else {
            // Handle other errors
            res.status(500).json({ error: err.message });
        }
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {

    const allowedUpdates = ['name'];
    try {

        const updates = req.body;

        // Filter updates to only include allowed fields
        const filteredUpdates = {};
        for (const key in updates) {
            if (allowedUpdates.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        }
        const user = await User.findByIdAndUpdate(req.params.id, { $set: filteredUpdates }, { new: true });
        const updatedUser = { id: user._id, name: user.name, email: user.email, mobile: user.mobile };
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listUsers = async (req, res) => {
    try {
        const users = await User.find({},{ password: 0 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.searchUser = async (req, res) => {
    console.log("query",req.query.name)   
     try {
        const users = await User.find({ name: new RegExp(req.query.name, 'i') });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.followUser = async (req, res) => {
    console.log("user",req.user.id)
    try {
        
        const [user, userToFollow] = await Promise.all([
            User.findById(req.user._id),
            User.findById(req.params.id),
          ]);
        

        if (!userToFollow || user.following.includes(userToFollow._id)) {
            return res.status(400).json({ msg: 'Cannot follow user' });
        }

        user.following.push(userToFollow._id);
        userToFollow.followers.push(user._id)
        await user.save();

        res.json({ msg: 'User followed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
