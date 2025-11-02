const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const transporter = require('../Utils/Mail');
const bcrypt = require('bcrypt');
const User = require('../Model/User');
const UserDao = require('../DAO/UserDAO');
const crypto = require('crypto');
router.put('/updateUser/:id', async (req, res) => {
    const { id } = req.params;
    const Email = req.body.Email;
    if (id !== Email) {
        return res.status(400).json({ success: false, message: 'Email in params and body do not match.' });
    }
    const Role = req.body.Role;
    const Password = req.body.Password;
    const isLocked = req.body.isLocked;
    console.log("update", req.body);

    const salt = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    const passWithSalt = Password + salt;
    const hashedPassword = crypto.createHash('sha512').update(passWithSalt).digest('hex');
    try {
        UserDao.updateUser(Email, Role, hashedPassword, isLocked)
        res.json({ success: true, message: `User ${Email} is updated successfully.` });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating user.', error: err.message });
    }

});
router.put('/updateUserNoPassword/:id', async (req, res) => {
    const { id } = req.params;
    const Email = req.body.Email;
    if (id !== Email) {
        return res.status(400).json({ success: false, message: 'Email in params and body do not match.' });
    }
    const Role = req.body.Role;
    const isLocked = req.body.isLocked;
    console.log("update", req.body);
    try {
        UserDao.updateUserNoPassword(Email, Role, isLocked)
        res.json({ success: true, message: `User ${Email} is updated successfully.` });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating user.', error: err.message });
    }

});
module.exports = router;