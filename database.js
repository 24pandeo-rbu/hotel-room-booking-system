const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./hotel.db", (err) => {

    if (err) {

        console.error("Database connection failed:", err.message);

    } else {

        console.log("Connected to SQLite database.");

    }

});


db.serialize(() => {

    // ==========================================
    // ROOMS TABLE
    // ==========================================

    db.run(`

        CREATE TABLE IF NOT EXISTS rooms (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            room_no TEXT UNIQUE NOT NULL,

            type TEXT NOT NULL,

            price REAL NOT NULL,

            status TEXT NOT NULL DEFAULT 'Available'

        )

    `);


    // ==========================================
    // BOOKINGS TABLE
    // ==========================================

    db.run(`

        CREATE TABLE IF NOT EXISTS bookings (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            room_id INTEGER NOT NULL,

            guest_name TEXT NOT NULL,

            check_in TEXT NOT NULL,

            check_out TEXT NOT NULL,

            FOREIGN KEY (room_id)
            REFERENCES rooms(id)

        )

    `);

});


module.exports = db;