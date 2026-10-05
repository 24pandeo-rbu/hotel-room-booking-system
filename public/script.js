// ==========================================
// LOAD ALL ROOMS
// ==========================================

async function loadRooms() {

    try {

        const response = await fetch("/api/rooms");

        const rooms = await response.json();

        const tableBody =
            document.getElementById("roomsTableBody");

        tableBody.innerHTML = "";

        rooms.forEach(room => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${room.id}</td>
                <td>${room.room_no}</td>
                <td>${room.type}</td>
                <td>₹${room.price}</td>
                <td>${room.status}</td>
            `;

            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error(error);

        alert("Unable to load rooms.");

    }
}


// ==========================================
// ADD ROOM
// ==========================================

document
    .getElementById("roomForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const roomNo =
            document.getElementById("roomNo").value.trim();

        const type =
            document.getElementById("roomType").value;

        const price =
            document.getElementById("roomPrice").value;

        const status =
            document.getElementById("roomStatus").value;


        try {

            const response = await fetch("/api/rooms", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    roomNo,
                    type,
                    price,
                    status
                })

            });


            const data = await response.json();

            const message =
                document.getElementById("roomMessage");


            if (!response.ok) {

                message.textContent = data.error;
                message.style.color = "red";

                return;
            }


            message.textContent =
                "Room added successfully.";

            message.style.color = "green";


            document
                .getElementById("roomForm")
                .reset();


            loadRooms();

        } catch (error) {

            console.error(error);

        }

    });


// ==========================================
// SEARCH AVAILABLE ROOMS
// ==========================================

document
    .getElementById("searchForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const type =
            document.getElementById("searchType").value;

        const checkIn =
            document.getElementById("searchCheckIn").value;

        const checkOut =
            document.getElementById("searchCheckOut").value;


        if (checkIn >= checkOut) {

            alert("Check-out date must be after check-in date.");

            return;
        }


        const params = new URLSearchParams({

            type,
            checkIn,
            checkOut

        });


        try {

            const response =
                await fetch(`/api/rooms/search?${params}`);


            const rooms = await response.json();


            const results =
                document.getElementById("searchResults");


            results.innerHTML = "";


            if (rooms.length === 0) {

                results.innerHTML = `
                    <div class="result-card">
                        No available rooms found.
                    </div>
                `;

                return;
            }


            rooms.forEach(room => {

                results.innerHTML += `

                    <div class="result-card">

                        <strong>
                            Room ${room.room_no}
                        </strong>

                        <p>
                            Type: ${room.type}
                        </p>

                        <p>
                            Price: ₹${room.price} per night
                        </p>

                        <p>
                            Status: Available
                        </p>

                    </div>

                `;

            });


        } catch (error) {

            console.error(error);

        }

    });


// ==========================================
// BOOK ROOM
// ==========================================

document
    .getElementById("bookingForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const roomNo =
            document.getElementById("bookingRoomNo").value.trim();

        const guestName =
            document.getElementById("guestName").value.trim();

        const checkIn =
            document.getElementById("checkIn").value;

        const checkOut =
            document.getElementById("checkOut").value;


        const message =
            document.getElementById("bookingMessage");


        if (checkIn >= checkOut) {

            message.textContent =
                "Check-out date must be after check-in date.";

            message.style.color = "red";

            return;
        }


        try {

            const response = await fetch("/api/bookings", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    roomNo,
                    guestName,
                    checkIn,
                    checkOut

                })

            });


            const data = await response.json();


            if (!response.ok) {

                message.textContent = data.error;

                message.style.color = "red";

                return;
            }


            message.textContent =
                "Room booked successfully.";

            message.style.color = "green";


            document
                .getElementById("bookingForm")
                .reset();


            loadBookings();

        } catch (error) {

            console.error(error);

            message.textContent =
                "Booking failed.";

            message.style.color = "red";

        }

    });


// ==========================================
// LOAD BOOKINGS
// ==========================================

async function loadBookings() {

    try {

        const response =
            await fetch("/api/bookings");


        const bookings =
            await response.json();


        const tableBody =
            document.getElementById("bookingsTableBody");


        tableBody.innerHTML = "";


        bookings.forEach(booking => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${booking.id}</td>

                <td>${booking.room_no}</td>

                <td>${booking.guest_name}</td>

                <td>${booking.check_in}</td>

                <td>${booking.check_out}</td>

                <td>

                    <button
                        class="cancel-button"
                        onclick="cancelBooking(${booking.id})"
                    >
                        Cancel
                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(error);

    }

}


// ==========================================
// CANCEL BOOKING
// ==========================================

async function cancelBooking(id) {

    const confirmCancel =
        confirm("Are you sure you want to cancel this booking?");


    if (!confirmCancel) {

        return;

    }


    try {

        const response =
            await fetch(`/api/bookings/${id}`, {

                method: "DELETE"

            });


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.error);

            return;

        }


        alert("Booking cancelled successfully.");


        loadBookings();


    } catch (error) {

        console.error(error);

        alert("Unable to cancel booking.");

    }

}


// ==========================================
// INITIAL PAGE LOAD
// ==========================================

loadRooms();

loadBookings();