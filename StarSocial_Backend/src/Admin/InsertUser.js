const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const transporter = require('../Utils/Mail');
const bcrypt = require('bcrypt');
const User = require('../Model/User');
const UserDao = require('../DAO/UserDAO');
const crypto = require('crypto');
const { ulid } = require('ulid');
const verifyToken = require('../Middlewares/verifyToken');
router.post('/insertUsers', verifyToken, async (req, res) => {
    const { email, password, role, isLocked } = req.body;
    const id = ulid();
    const salt = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    const passWithSalt = password + salt;
    console.log("Insert user with email: ", email);
    console.log("Generated salt: ", salt);
    console.log("Password with salt: ", password);
    console.log("Password with salt: ", passWithSalt);

    // 1. Hash mật khẩu
    // const hashedPassword = await bcrypt.hash(passWithSalt, 10);
    const hashedPassword = crypto.createHash('sha512').update(passWithSalt).digest('hex');
    const newUser = new User({
        User_id: id,
        Last_name: "abc",
        Email: email,
        First_Name: "abc",
        Password: hashedPassword,
        Salt: salt,
        Role: role,
        Date_Of_Birth: null,
        Profile_Picture: null,
        Description: null,
        Reliability: null,
        gender: null,
        isLocked: isLocked,
        ReportedPosts: 0,
        Quantities_Posts: 0,
        QuantitiesFollowers: 0
    });

    console.log("Inserting user: ", newUser);
    try {
        await UserDao.insert(newUser);
        res.json({ success: true, message: 'User inserted successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error inserting user.', error: err.message });
    }
});
module.exports = router;