# Proposify Take-Home Challenge

## Project Overview

This is a full-stack web application built using **React** for the frontend and **Node.js** for the backend. It demonstrates key features such as user authentication, real-time collaboration, and API interactions.

## Technology Stack

- **Frontend:** React, React Router, Context API, Tailwind CSS, Material UI Icons, Tip-tap, Socket Io
- **Backend:** Node.js, Express.js, Socket io
- **Database:** In-memory
- **Authentication:** JWT (JSON Web Token)

## Features Implemented

- **User Authentication:** JWT-based login and registration with basic validation using regular expressions.
- **Real-Time Collaboration:** WebSocket integration for live collaboration.
- **Navigation:** React Router for seamless navigation between pages.
- **State Management:** Context API to manage application state.
- **API Interactions:** Communication between frontend and backend through API requests.
- **Text Editor:** Basic formatting options in the text editor (using Tip-tap).

## Future Improvements

- Implement persistent storage with a database.
- Enhance error handling and logging mechanisms.
- Add more formatting options (e.g., image uploads, font style changes).
- Include email verification during registration.

## Running the Project

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16+ recommended)
- **npm** or **yarn**

### Setup Instructions

#### 1. Clone the repository

```bash
git clone https://github.com/vrajpatel1411/Proposify-TakeHome-Challenege.git
cd Proposify-TakeHome-Challenege
```

#### 2. Install Dependencies

##### Backend

```sh
cd backend
npm install

```

##### Frontend

```sh
cd ../frontend
npm install

```

#### 4. Start the Application

##### Start Backend Server

```sh
cd backend
npm run dev
```

##### Start Frontend Server

```sh
cd ../frontend
npm start
```

The application should now be running:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3005`

### Testing Real-Time Collaboration

To test real-time collaboration:

- Open a new incognito tab or another browser and initiate a new session.
- Observe real-time updates between users.

You can also test how the app reacts when the backend is disconnected by stopping the backend server.
