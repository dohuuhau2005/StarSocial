const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Model/User');
const UserDao = require('../DAO/UserDAO');

const verifyToken = require('../Middlewares/verifyToken');
router.get('/getAllUsers', verifyToken, async (req, res) => {
    try {
        const users = await UserDao.getAllUsers();
        res.json({ success: true, users: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving users.', error: err.message });
    }
});
module.exports = router;