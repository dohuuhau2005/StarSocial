require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 3000;
// const { GetPrimaryDBPool, GetnotificationDBPool } = require('./src/Config/SqlConnection');
// const { client ,clientConnection} = require('./src/Config/Redis');
app.use(cors());
app.use(express.json());
//test database connections
// GetPrimaryDBPool();
// GetnotificationDBPool();
// clientConnection();

app.use('/register', require('./src/Route/Register'));
app.use('/login', require('./src/Route/Login'));

//admin routes
app.use('/admin', require('./src/Admin/GetAllUser'));
app.use('/admin', require('./src/Admin/InsertUser'));
app.use('/admin', require('./src/Admin/DeleteUser'));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;