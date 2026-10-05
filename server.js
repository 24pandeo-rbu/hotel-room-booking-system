const express = require("express");

const db = require("./database");

const path = require("path");


const app = express();

const PORT = 3000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});


// ==========================================
// GET ALL ROOMS
// ==========================================

app.get("/api/rooms", (req, res) => {

    const sql = `

        SELECT *

        FROM rooms

        ORDER BY room_no

    `;


    db.all(sql, [], (err, rows) => {

        if (err) {

            return res.status(500).json({

                error: err.message

            });

        }


        res.json(rows);

    });

});


// ==========================================
// ADD NEW ROOM
// ==========================================

app.post("/api/rooms", (req, res) => {

    const {
        roomNo,
        type,
        price,
        status
    } = req.body;


    if (
        !roomNo ||
        !type ||
        !price
    ) {

        return res.status(400).json({

            error: "All room details are required."

        });

    }


    if (Number(price) <= 0) {

        return res.status(400).json({

            error: "Price must be greater than zero."

        });

    }


    const sql = `

        INSERT INTO rooms
        (room_no, type, price, status)

        VALUES (?, ?, ?, ?)

    `;


    db.run(

        sql,

        [
            roomNo,
            type,
            Number(price),
            status || "Available"
        ],

        function(err) {

            if (err) {

                if (
                    err.message.includes("UNIQUE")
                ) {

                    return res.status(409).json({

                        error:
                        "Room number already exists."

                    });

                }


                return res.status(500).json({

                    error: err.message

                });

            }


            res.status(201).json({

                message: "Room added successfully.",

                roomId: this.lastID

            });

        }

    );

});


// ==========================================
// SEARCH AVAILABLE ROOMS
// ==========================================

app.get("/api/rooms/search", (req, res) => {

    const {
        type,
        checkIn,
        checkOut
    } = req.query;


    if (!checkIn || !checkOut) {

        return res.status(400).json({

            error:
            "Check-in and check-out dates are required."

        });

    }


    if (checkIn >= checkOut) {

        return res.status(400).json({

            error:
            "Check-out date must be after check-in date."

        });

    }


    let sql = `

        SELECT *

        FROM rooms r

        WHERE r.status = 'Available'

        AND NOT EXISTS (

            SELECT 1

            FROM bookings b

            WHERE b.room_id = r.id

            AND b.check_in < ?

            AND b.check_out > ?

        )

    `;


    const params = [

        checkOut,
        checkIn

    ];


    if (type) {

        sql += ` AND r.type = ?`;

        params.push(type);

    }


    sql += ` ORDER BY r.room_no`;


    db.all(sql, params, (err, rows) => {

        if (err) {

            return res.status(500).json({

                error: err.message

            });

        }


        res.json(rows);

    });

});


// ==========================================
// GET ALL BOOKINGS
// ==========================================

app.get("/api/bookings", (req, res) => {

    const sql = `

        SELECT

            b.id,

            r.room_no,

            b.guest_name,

            b.check_in,

            b.check_out

        FROM bookings b

        JOIN rooms r
        ON b.room_id = r.id

        ORDER BY b.check_in

    `;


    db.all(sql, [], (err, rows) => {

        if (err) {

            return res.status(500).json({

                error: err.message

            });

        }


        res.json(rows);

    });

});


// ==========================================
// BOOK A ROOM
// ==========================================

app.post("/api/bookings", (req, res) => {

    const {
        roomNo,
        guestName,
        checkIn,
        checkOut
    } = req.body;


    // ------------------------------------------
    // BASIC VALIDATION
    // ------------------------------------------

    if (
        !roomNo ||
        !guestName ||
        !checkIn ||
        !checkOut
    ) {

        return res.status(400).json({

            error:
            "All booking details are required."

        });

    }


    if (checkIn >= checkOut) {

        return res.status(400).json({

            error:
            "Check-out date must be after check-in date."

        });

    }


    // ------------------------------------------
    // FIND ROOM
    // ------------------------------------------

    db.get(

        `SELECT * FROM rooms WHERE room_no = ?`,

        [roomNo],

        (err, room) => {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }


            if (!room) {

                return res.status(404).json({

                    error:
                    "Room does not exist."

                });

            }


            if (room.status !== "Available") {

                return res.status(400).json({

                    error:
                    "This room is not currently available."

                });

            }


            // ------------------------------------------
            // CHECK OVERLAPPING BOOKING
            // ------------------------------------------

            const overlapSQL = `

                SELECT *

                FROM bookings

                WHERE room_id = ?

                AND check_in < ?

                AND check_out > ?

            `;


            db.get(

                overlapSQL,

                [
                    room.id,
                    checkOut,
                    checkIn
                ],

                (err, existingBooking) => {

                    if (err) {

                        return res.status(500).json({

                            error: err.message

                        });

                    }


                    if (existingBooking) {

                        return res.status(409).json({

                            error:
                            "Room is already booked for the selected dates."

                        });

                    }


                    // ------------------------------------------
                    // CREATE BOOKING
                    // ------------------------------------------

                    const insertSQL = `

                        INSERT INTO bookings

                        (
                            room_id,
                            guest_name,
                            check_in,
                            check_out
                        )

                        VALUES (?, ?, ?, ?)

                    `;


                    db.run(

                        insertSQL,

                        [
                            room.id,
                            guestName,
                            checkIn,
                            checkOut
                        ],

                        function(err) {

                            if (err) {

                                return res.status(500).json({

                                    error:
                                    err.message

                                });

                            }


                            res.status(201).json({

                                message:
                                "Room booked successfully.",

                                bookingId:
                                this.lastID

                            });

                        }

                    );

                }

            );

        }

    );

});


// ==========================================
// CANCEL / DELETE BOOKING
// ==========================================

app.delete("/api/bookings/:id", (req, res) => {

    const bookingId =
        req.params.id;


    db.run(

        `DELETE FROM bookings WHERE id = ?`,

        [bookingId],

        function(err) {

            if (err) {

                return res.status(500).json({

                    error: err.message

                });

            }


            if (this.changes === 0) {

                return res.status(404).json({

                    error:
                    "Booking not found."

                });

            }


            res.json({

                message:
                "Booking cancelled successfully."

            });

        }

    );

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});