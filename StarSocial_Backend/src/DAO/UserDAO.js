const sql = require('mssql');
const db = require('../Config/SqlConnection');

const UserDao = {
    insert: async (user) => {
        try {
            const pool = await db.GetPrimaryDBPool();
            const request = pool.request();
            request.input('User_id', sql.VarChar, user._User_id);
            request.input('Last_name', sql.NVarChar, user._Last_name);
            request.input('Email', sql.VarChar, user._Email);
            request.input('Role', sql.VarChar, user._Role);
            request.input('First_Name', sql.NVarChar, user._First_Name);
            request.input('Date_Of_Birth', sql.Date, user._Date_Of_Birth);
            request.input('Profile_Picture', sql.VarChar, user._Profile_Picture);
            request.input('Description', sql.NVarChar, user._Description);
            request.input('Reliability', sql.VarChar, user._Reliability);
            request.input('isLocked', sql.Bit, user._isLocked);
            request.input('ReportedPosts', sql.Int, user._ReportedPosts);
            request.input('Quantities_Posts', sql.Int, user._Quantities_Posts);
            request.input('QuantitiesFollowers', sql.BigInt, user._QuantitiesFollowers);
            request.input('Password', sql.NVarChar, user._Password); // Đã đổi thành NVarChar
            request.input('Salt', sql.NVarChar, user._Salt);       // Đã đổi thành NVarChar
            request.input('gender', sql.NVarChar, user._gender);

            const sqlQuery = `
    INSERT INTO Users (
        User_id, Last_name, Email, Role, First_Name, 
        Date_Of_Birth, Profile_Picture, Description, 
        Reliability, isLocked, ReportedPosts, 
        Quantities_Posts, QuantitiesFollowers, 
        Password, Salt, gender
    )
    VALUES (
        @User_id, @Last_name, @Email, @Role, @First_Name, 
        @Date_Of_Birth, @Profile_Picture, @Description, 
        @Reliability, @isLocked, @ReportedPosts, 
        @Quantities_Posts, @QuantitiesFollowers, 
        @Password, @Salt, @gender
    )
`;
            await request.query(sqlQuery);
            console.log(`User ${user._Email} inserted successfully`);
        } catch (err) {
            throw err;
        }
    },
    getAllUsers: async () => {
        try {
            const pool = await db.GetPrimaryDBPool();
            const result = await pool.request().query('SELECT * FROM Users');
            return result.recordset;
        } catch (err) {
            throw err;
        }
    },
    deleteUserByEmail: async (email) => {
        try {
            const pool = await db.GetPrimaryDBPool();
            const request = pool.request();
            request.input('Email', sql.VarChar, email);
            const sqlQuery = 'DELETE FROM Users WHERE Email = @Email';
            const result = await request.query(sqlQuery);
            console.log(`User with ID ${userId} deleted successfully`);
            return result;
        } catch (err) {
            throw err;
        }
    }
}
module.exports = UserDao;