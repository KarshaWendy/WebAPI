const mysql = require('mysql')
const express =require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.port  || 5000

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json()) //passing JSON data to queries

//connection pool to reuse commands executed on the DB

const pool =mysql.createPool({
    connectionLimit : 10,
    host            :'localhost',
    user            :'root',
    password        : '',
    database        : 'hotel_smart'
});

// queries from guests
// GET request for favourites
// return a list of favourited rooms
app.get('/get_favourites',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT favourites.id, favourites.name, favourites.type, favourites.count' ,(err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

// GET request for favourites by ID
app.get('/get_favourites/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT favourites.id, favourites.name, favourites.type, favourites.count WHERE favourites.id = favourited.id', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})
// favourites for a specific user =  SELECT from favourites where 

// DELETE request for favourites by ID
app.delete('/get_favourites/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('DELETE from favourites WHERE id = ?', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The favourited item: ${[req.params.id] no longer exists.')
            } else {
                console.log(err)
            }
        })
    })
}) 

// add request for favourites
app.post('',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')
// requires room id and guest id
        const params = req.body 
        console.log(req.body)
        connection.query("INSERT INTO `favourites` (`id`,`type`,`name`,`count`,`created`,`modified`) VALUES(?,?,?,?,?)",[params.name,params.type,params.count,params.created,params.modified], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The room has been favourited successfully.')
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})


//Administrator requests
// GET request for guests
app.get('/allguests_list',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT guests.id, guests.name, guests.email, guests.phone, reservations.date as reservations_date, room.type as room_type, guests.created, guests.modified FROM `guests`, `reservations`,`room`, WHERE guests.reservation_id = reservations.id AND reservations.room_id = room.id; ',(err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

// GET request for guests by ID
app.get('/allguests_list/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT guests.id, guests.name, guests.email, guests.phone, reservations.date as reservation_date, room.type as room_type, guests.created, guests.modified FROM `guests`, `reservations`,`room`, WHERE guests.reservation_id = reservations.id AND reservations.room_id = room.id AND guests.id=?;', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})
//administrators getting all reservations
app.get('/allreservation_list',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT reservation.id, reservation.date,reservation.check_in,reservation.cost,reservation.status,reservation.check_out,reservation.created,reservation.modified FROM `reservations`; ',(err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

// GET request for reservations by ID
app.get('/reservation_list/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT reservation.id, reservation.date, reservation.check_in, reservation.cost, reservation.status, reservation.check_out, reservation.created, reservation.modified, room.id  FROM `reservation`, `room`, WHERE reservation.room_id = room.id AND reservation.id=?;', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

//administrators get request for reservations by date
app.get('/reservation_list/:date',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT reservation.id, reservation.date, reservation.check_in, reservation.cost, reservation.status, reservation.check_out, reservation.created, reservation.modified, room.id  FROM `reservation`, `room`, WHERE reservation.room_id = room.id AND reservation.date=?;', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

//administrators getting all rooms
app.get('/allrooms_list',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT room.id, room.count, room.type , room.status, room.created, room.modified FROM `room`; ',(err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

// GET request for rooms by ID
app.get('/room_list/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT room.id, room.count, room.type , room.status, room.created, room.modified, reservation.date  FROM `room`,`reservations`, WHERE room.reservation_id = reservation.id AND room.id=?;', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})


//administrators getting all payments
app.get('/allpayments_list',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT payment.id, payment.count, payment.date , payment.amount, payment.modified, guest.name FROM `payment`,`guest`; ',(err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

// GET request for payments by ID
app.get('/payments_list/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT payment.id, payment.count, payment.date , payment.amount, payment.modified, guest.name FROM `payment`,`guest`, WHERE payment.room_id = room.id AND payment.id=?;', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})
// // GET request for payments by guest ID
// app.get('/payments_list/:id',(req, res) => {

//     pool.getConnection((err, connection) =>{
//         if(err) throw err
//         console.log('connected as id ${connection.threadId}')

//         connection.query('SELECT payment.id, payment.count, payment.date , payment.amount, payment.modified, guest.name FROM `payment`,`guest`, WHERE payment.room_id = room.id AND payment.id=?;', [req.params.id], (err, rows) =>{
//             connection.release() //return the connection to pool

//             if(!err) {
//                 res.send(rows)
//             } else {
//                 console.log(err)
//             }
//         })
//     })
// })
// DELETE request for guests by ID
app.delete('/allguest_list/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('DELETE from guests WHERE id = ?', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The guest: ${[req.params.id] no longer exists.')
            } else {
                console.log(err)
            }
        })
    })
}) 
// DELETE request for reservation by ID
app.delete('/allreservations_list/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('DELETE from reservation WHERE id = ?', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The reservation: ${[req.params.id] no longer exists.')
            } else {
                console.log(err)
            }
        })
    })
}) 

// add request for guests
app.post('',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        const params = req.body 
        console.log(req.body)
        connection.query("INSERT INTO `guests` (`name`,`email`,`phone`,`reservation_date`,`staff_no`,`room_type`,`created`,`modified`) VALUES(?,?,?,?,?,?)",[params.name,params.email,params.phone,params.reservation_date,params.staff_no,params.room_type,params.created,params.modified], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The guest reservation has been added successfully.')
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})

// update request for guests
app.post('',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        const params = req.body 
        connection.query("INSERT INTO `guests` (`name`,`email`,`phone`,'reservation_date', `created`, `modified`) VALUES(?,?,?,?,?,?)",[params.name,params.email,params.phone,params.reservation_name,params.created,params.modified], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The guest reservation has been added successfully.')
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})

//GET request for reservations
app.get('/reservations/',(req, res) => {
    console.log('hello')
    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('hello')
        connection.query('SELECT * from reservations', (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

// GET request for reservations by ID
app.get('/reservations/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT * from reservations WHERE id = ?', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})


// DELETE request for reservations by ID
app.delete('/reservations/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('DELETE from reservations WHERE id = ?', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The reservation: ${[req.params.id] no longer exists.')
            } else {
                console.log(err)
            }
        })
    })
})

// add request for reservations
app.post('/reservations',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        const params = req.body 
        connection.query("INSERT INTO `reservations` (`date`,`check_in`,`check_out`,`adults`, `children`,`room_status`,`created`, `modified`) VALUES(?,?,?,?,?,?,?,?)",[params.date,params.check_in,params.check_out,params.children,params.adults,params.room_status,params.created,params.modified], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The reservation has been added successfully.')
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})
// update request for reservations
app.put('/reservations/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')
 
        const{id,date,check_in,check_out,adults, children,room_status,created,modified} = req.body
        console.log(req.body)
        
        connection.query('UPDATE reservations SET date=?,check_in = ?,check_out = ?,adults = ?,children = ?,room_status = ?,created =?, modified =? WHERE id =?',[date,check_in,check_out,adults,children,room_status,created,modified,id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The reservation has been updated successfully.')
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})
//GET request for administrators
app.get('/administrators',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT * from administrators',(err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

// GET request for administrators by ID
app.get('/administrators/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT * from administrators WHERE id = ?', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})


// DELETE request for administrators by ID
app.delete('/administrators/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('DELETE from administrators WHERE id = ?', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The administrator: ${[req.params.id] no longer exists.')
            } else {
                console.log(err)
            }
        })
    })
})

// add request for administrators
app.post('/administrators',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        const params = req.body 
        connection.query("INSERT INTO `administrators` (`name`,`staff_no`,`created`, `modified`) VALUES(?,?,?,?)",[params.name,params.staff_email,params.created,params.modified], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The administrator has been added successfully.')
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})


// update request for administrator
app.put('/administrators/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')
 
        const{id,name,email,created, modified} = req.body
        
        connection.query('UPDATE administrators SET name =?, email =?, modified =? WHERE id =?',[id,name,email, modified], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The administrator: ${[name] has been updated successfully.')
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})

//GET request for payments
app.get('/payment',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT * from payment',(err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

// GET request for administrators by ID
app.get('/payment/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT * from payment WHERE id = ?', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})


// DELETE request for administrators by ID
app.delete('/payment/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('DELETE from payment WHERE id = ?', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The payment: ${[req.params.id] no longer exists.')
            } else {
                console.log(err)
            }
        })
    })
})

// add request for administrators
app.post('/payment',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        const params = req.body 
        connection.query("INSERT INTO `payment` (`id`,`date`,`amount`,`created`, `modified`) VALUES(?,?,?,?,?)",[params.date,params.amount,params.created,params.modified], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The payment has been added successfully.')
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})


// update request for administrator
app.put('/payment/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')
 
        const{id,name,email,created, modified} = req.body
        
        connection.query('UPDATE payment SET date =?, amount =?, modified =? WHERE id =?',[id,date,amount, modified], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The payment: ${[name] has been updated successfully.')
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})
//GET request for room
app.get('/room',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT * from room',(err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

// GET request for administrators by ID
app.get('/room/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('SELECT * from room WHERE id = ?', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})


// DELETE request for administrators by ID
app.delete('/room/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        connection.query('DELETE from room WHERE id = ?', [req.params.id], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The room: ${[req.params.id] no longer exists.')
            } else {
                console.log(err)
            }
        })
    })
})

// add request for administrators
app.post('/room',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')

        const params = req.body 
        connection.query("INSERT INTO `room` (`id`,`type`,`status`,`count`,`created`, `modified`) VALUES(?,?,?,?,?,?)",[params.type,params.status,params.count,params.created,params.modified], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The room has been added successfully.')
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})


// update request for room
app.put('/room/:id',(req, res) => {

    pool.getConnection((err, connection) =>{
        if(err) throw err
        console.log('connected as id ${connection.threadId}')
 
        const{id,type,status,count,created, modified} = req.body
        
        connection.query('UPDATE room SET type =?, status =?,count =?, modified =? WHERE id =?',[id,type,status,count,created, modified], (err, rows) =>{
            connection.release() //return the connection to pool

            if(!err) {
                res.send('The room: ${[name] has been updated successfully.')
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})


// listen to specified port 
app.listen(port, () => console.log(`Server started at port ${port}`));