const mysql = require('mysql')
const express =require('express')
const bodyParser = require('body-parser')

var app =express();
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database: 'hotel_smart'
});

mysqlConnection.connect((err) =>{
    if(!err)
    console.log('Database connection is successful');
     else
     console.log('Database connection failed Error : ' + JSON.stringify(err, undefined, 2));

});
const PORT = 5000;
app.listen(PORT, console.log(`Server started at port ${PORT}`));