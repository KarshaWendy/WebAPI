const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}))

// parse application/json
app.use(bodyParser.json())

// MySQL
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'booking_system'
});

// var db = require('./db.js');
// Get all rooms
app.get('/admin/room', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from room ', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from room table are: \n', rows)
        })
    })
})
app.get('/admin/favourites', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from favourites', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from room table are: \n', rows)
        })
    })
})
// Get a specific room
app.get('/admin/room/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM room WHERE roomid = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from room table are: \n', rows)
        })
    })
});
// Delete a room
app.delete('/admin/room/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM room WHERE roomid = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`The room with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from room table are: \n', rows)
        })
    })
});
// Add a room
app.post('/administrator/room', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body
        connection.query('INSERT INTO room SET ?', params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`Room with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from room table has been added \n', rows)

        })
    })
});

//Update a room status
app.put('/administrator/room/update', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { roomid, count, created, modified,type,status } = req.body

        connection.query('UPDATE room SET roomid = ?, count = ?, created = ?, modified = ?, type = ?, status = ? WHERE roomid = ?', [roomid,count,created,modified,type,status] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`room with the has been updated.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})
// Get all guests 
app.get('/admin/guest', (req, res) => {
    // res.send('ok')
    // return;
    // db.query('SELECT * from guest', (err, rows) => {
    //     connection.release() // return the connection to pool

    //     if (!err) {
    //         res.send(rows)
    //     } else {
    //         console.log(err)
    //     }

    //     // if(err) throw err
    //     console.log('The data from guest table are: \n', rows)
    // })
    // return;
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from guest', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from guest table are: \n', rows)
        })
    })
})
// Get a specific guest
app.get('/admin/guest/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM guest WHERE guestid = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from guest table are: \n', rows)
        })
    })
});
// Delete a guest
app.delete('/admin/guest/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM guest WHERE guestid = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`The guest with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from guest table are: \n', rows)
        })
    })
});
// Add a guest
app.post('/administrator/guest', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body
        connection.query('INSERT INTO guest SET ?', params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`guest with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from guest table are:11 \n', rows)

        })
    })
});

//Update a guest 
app.put('/administrator/guest/update', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { guestid, name, email,phone, password, created, modified, } = req.body

        connection.query('UPDATE guest SET guestid = ?, email = ?, phone = ?,password = ?, name = ? created = ?, modified = ? WHERE guestid = ?', [guestid,name,email,password,phone,created,modified] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`guest with the name: ${name} has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})
// Get all payments
app.get('/admin/payment', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from payment', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from payment table are: \n', rows)
        })
    })
})
// Get a specific payment
app.get('/admin/payment/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM payment WHERE paymentid = ? AND guest.guestid =?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from payment table are: \n', rows)
        })
    })
});
// Delete a payment
app.delete('/admin/payment/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM payment WHERE paymentid = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`The payment with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from payment table are: \n', rows)
        })
    })
});
// Add a payment
app.post('/administrator/payment', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body
        connection.query('INSERT INTO payment SET ?', params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`payment with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from payment table are:11 \n', rows)

        })
    })
});

//Update a payment status
app.put('/administrator/payment/update', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { paymentid, date, amount, created, modified, } = req.body

        connection.query('UPDATE payment SET paymentid = ?, date= ?, amount = ?, created = ?, modified = ? WHERE paymentid = ? AND guest.guestid = ?', [paymentid,amount,date,created,modified] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`payment with the has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})
// Get all reservations
app.get('/admin/reservation', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from reservation', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from reservation table are: \n', rows)
        })
    })
})
// Get a specific reservation
app.get('/admin/reservation/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM reservation WHERE reservationid = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from reservation table are: \n', rows)
        })
    })
});
// Delete a reservation
app.delete('/admin/reservation/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM reservation WHERE reservationid = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`The reservation with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from reservation table are: \n', rows)
        })
    })
});
// Add a reservation
app.post('/administrator/reservation', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body
        connection.query('INSERT INTO reservation SET ?', params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`reservation with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from reservation table are:11 \n', rows)

        })
    })
});

//Update a reservation 
app.put('/administrator/reservation/update', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { reservationid, date, check_in, status, check_out, created, modified, } = req.body

        connection.query('UPDATE reservation SET reservationid = ?, date= ?, check_in = ?, check_out = ?, status = ?, created = ?, modified = ? WHERE reservationid = ? AND guest.guestid =?', [reservationid,check_in,check_out,status,date,created,modified] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`reservation has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})

// Listen on enviroment port or 3306
app.listen(port, () => console.log(`Listening on port ${port}`))