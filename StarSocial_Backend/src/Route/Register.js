const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const transporter = require('../Utils/Mail');
const bcrypt = require('bcrypt');
const User = require('../Model/User');
const UserDao = require('../DAO/UserDAO');
const crypto = require('crypto');
const { ulid } = require('ulid');

router.post('/', async (req, res) => {
    const { email, lastName, firstName, password, gender, DOB, role } = req.body;
    console.log("--------Register user with email:--------- ", req.body);
    const salt = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    const passWithSalt = password + salt;

    // 1. Hash mật khẩu
    // const hashedPassword = await bcrypt.hash(passWithSalt, 10);
    const hashedPassword = crypto.createHash('sha512').update(passWithSalt).digest('hex');
    console.log("regis " + hashedPassword)
    // //test luu
    // await verifyUserEmail(email, { gender, DOB, salt, role, password });


    // 3. Tạo token xác minh
    const token = jwt.sign({ email, firstName, lastName, gender, DOB, salt, role, password: hashedPassword }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 4. Gửi mail xác minh
    const portReact = process.env.port_React;
    const verifyUrl = `${portReact}/verify?token=${token}`;
    console.log("verifyUrl" + token);
    await transporter.sendMail({
        to: email,
        subject: 'Xác minh email',
        html: `<p>Nhấn vào đây để xác minh: <a href="${verifyUrl}">Verify Email</a></p>`
    });

    res.json({ message: 'Vui lòng kiểm tra email để xác minh.' });
});
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    try {
        // const decoded = jwt.verify(token,process.env.JWT_SECRET ); 
        //      const email = decoded.email;
        const { email, firstName, lastName, gender, DOB, salt, role, password } = jwt.verify(token, process.env.JWT_SECRET);
        console.log("token verify email" + token);
        console.log("--------debug verify email:--------- ", email, firstName, lastName)
        // Cập nhật user là đã xác minh
        await verifyUserEmail(email, { firstName, lastName, gender, DOB, salt, role, password }); // custom function update isVerified=true

        res.json({ success: true, message: 'Xác minh thành công.' });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
});
const verifyUserEmail = async (email, userData) => {
    const id = ulid();

    const newUser = new User({
        User_id: ulid(), // hoặc id nếu bạn đã có
        Last_name: userData.lastName,
        Email: email,
        First_Name: userData.firstName,
        Password: userData.password,
        Salt: userData.salt,
        Role: userData.role,
        Date_Of_Birth: userData.DOB,
        gender: userData.gender,
        isLocked: 0,
        ReportedPosts: 0,
        Quantities_Posts: 0,
        QuantitiesFollowers: 0
    });
    console.log("Inserting verified user: ", newUser);

    try {
        await UserDao.insert(newUser);
    } catch (err) {
        console.error("Error inserting verified user: ", err);
        throw err;
    }




}
module.exports = router;