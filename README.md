# Hotel Room Booking System

A full-stack web-based Hotel Room Booking System developed as part of Teacher Assessment-1. The application allows users to manage hotel rooms and guest bookings through a simple and user-friendly web interface.

---

## 1. Project Overview

The **Hotel Room Booking System** is designed to simplify the process of managing hotel rooms and customer bookings.

The application provides functionality to:

- Add new hotel rooms
- View all available and registered rooms
- Search for rooms based on room type and dates
- Book a room for a guest
- View existing bookings
- Cancel bookings
- Check room availability
- Prevent double-booking of rooms for overlapping dates
- Store room and booking information permanently using SQLite

The project demonstrates the practical implementation of **full-stack web development**, including frontend development, backend server development, RESTful APIs, database integration, HTTP communication, JSON data handling, and CRUD operations.

---

## 2. Objectives

The main objectives of this project are:

1. To develop a user-friendly interface for managing hotel rooms and bookings.
2. To implement room management operations using a web-based application.
3. To develop RESTful API endpoints using Node.js and Express.js.
4. To store room and booking information using SQLite.
5. To establish communication between the frontend and backend using HTTP requests and JSON.
6. To implement booking validation and prevent overlapping bookings.
7. To dynamically update room and booking information without manually reloading the webpage.
8. To understand the practical implementation of full-stack web application architecture.

---

## 3. Main Features

### Room Management

- Add a new hotel room.
- Store room number, room type, price, and availability information.
- View the list of registered rooms.

### Room Search

- Search for available rooms.
- Filter rooms based on room type and booking dates.
- Display the availability status of rooms.

### Room Booking

- Enter guest details.
- Select check-in and check-out dates.
- Book an available room.
- Store booking information in the database.

### Booking Management

- View existing bookings.
- Cancel an existing booking.
- Update room availability after booking or cancellation.

### Booking Validation

- Prevent booking of an already reserved room.
- Check for overlapping check-in and check-out dates.
- Handle invalid booking requests.
- Handle attempts to cancel a non-existent booking.

### Database Management

- Store room information in SQLite.
- Store booking information in SQLite.
- Maintain persistent data between server restarts.

---

## 4. Technologies and Tools Used

### Frontend

- **HTML5** – Used to create the structure of the web application.
- **CSS3** – Used for styling and layout.
- **JavaScript** – Used for frontend logic and interaction.
- **Fetch API** – Used for communication between the frontend and backend.

### Backend

- **Node.js** – JavaScript runtime used to create the backend server.
- **Express.js** – Web framework used to create RESTful APIs and handle HTTP requests.

### Database

- **SQLite** – Lightweight relational database used for persistent storage of room and booking information.

### Development Tools

- **Visual Studio Code** – Code editor used for development.
- **Git** – Version control system.
- **GitHub** – Used for source code hosting and submission.
- **npm** – Used for installing and managing Node.js dependencies.




  ## Instructions to Run the Project

### Prerequisites

Before running the project, make sure the following software is installed:

- Node.js
- npm
- Git
- Visual Studio Code
- A modern web browser such as Google Chrome

### Step 1: Clone the GitHub Repository

Open **PowerShell** or the **VS Code Terminal** and run:

```bash
git clone https://github.com/24pandeo-rbu/hotel-room-booking-system.git

---



### 5. System Architecture

The application follows a basic full-stack architecture:

```text
                User
                  |
                  v
        +-------------------+
        |   Frontend        |
        | HTML / CSS / JS   |
        +-------------------+
                  |
             HTTP / JSON
                  |
                  v
        +-------------------+
        |   Express.js      |
        |   Node.js Server  |
        +-------------------+
                  |
                  v
        +-------------------+
        |      SQLite       |
        |      Database     |
        +-------------------+
