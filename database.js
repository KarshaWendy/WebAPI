const mysql = require('mysql')

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database: 'hotel_smart'
});

mysqlConnection.connect(function(error) {
    if (error) {
        console.log(error);
        return error;
    } else {
        console.log('Database is connected ..!!')
    }
});

module.exports = mysqlConnection;