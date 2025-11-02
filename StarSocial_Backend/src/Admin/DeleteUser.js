const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserDao = require('../DAO/UserDAO');
const verifyToken = require('../Middlewares/verifyToken');
router.delete('/deleteUser/:id', verifyToken, async (req, res) => {
    const email = req.params.id;
    console.log("Deleting user with email: ", email);
    try {
        const result = await UserDao.deleteUserByEmail(email);
        res.json({ success: true, message: `User with email ${email} deleted successfully.` });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting user.', error: err.message });
    }
});
module.exports = router;