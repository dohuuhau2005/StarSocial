const sql = require('mssql');

const dbConfigPrimaryDB = {
    user: process.env.DB_User,
    password: process.env.DB_Password,
    server: process.env.DB_Server,
	port:1434,
    database: process.env.DB_PrimaryDBName,
    options: {
        encrypt: true, // bắt buộc nếu dùng Azure
        trustServerCertificate: true, // cần thiết cho local SQL Server
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }

};

const dbConfigNotification = {
    user: process.env.DB_User,
    password: process.env.DB_Password,
    server: process.env.DB_Server,
	port:1434,
    database: process.env.DB_NotificationDBName,
    options: {
        encrypt: true, // bắt buộc nếu dùng Azure
        trustServerCertificate: true, // cần thiết cho local SQL Server
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }

};
let primaryDBPool;
let notificationDBPool;
const GetPrimaryDBPool = async () => {
try{
    primaryDBPool = await sql.connect(dbConfigPrimaryDB);
    console.log("Kết nối đến cơ sở dữ liệu primary!");
    return primaryDBPool;
}
catch(err){
    console.error("Lỗi kết nối đến cơ sở dữ liệu: primary "+process.env.DB_User, err);
    throw err;
}};

const GetnotificationDBPool = async () => {
    try{
        notificationDBPool= await sql.connect(dbConfigNotification);
        console.log("Kết nối đến cơ sở dữ liệu notification!");
        return notificationDBPool;
    }
    catch(err){
        console.error("Lỗi kết nối đến cơ sở dữ liệu: notification "+process.env.DB_User, err);
        throw err;
    }
};

module.exports = {GetPrimaryDBPool, GetnotificationDBPool};