# Parking Violation Reporting System

## Description

- A full-stack web application to report and manage parking violations. The system has two main modules:

- User Module: Allows users to log in and report incorrectly parked vehicles.

- Admin Module: Allows admins to view all reports, update statuses, and manage violations from a dashboard.

## Features

### User Side

- User Authentication (Login/Signup)

- Submit new parking violation reports with details like location and issue description

- View confirmation after successful report submission

### Admin Side

- Admin Authentication (Login/Signup)

- View all user-submitted parking violation reports

- Update the status of each report (e.g., "Under Review", "Action Taken", etc.)

- View a dashboard with important statistics (like total reports, actioned reports)

## Technologies Used

- Frontend: React.js (Vite)

- Backend: NestJS

- Database: MongoDB 



## How to Run Locally

### Prerequisites

- Node.js (v18 or higher)

- MongoDB Database

### Clone the Repository
```
git clone https://github.com/aljithkj02/parking-violation-logger.git
cd parking-violation-logger
```

### Setup Backend

```
cd server
npm install
```

### Create a .env file inside the server folder:

```
DATABASE_URL="your_mongodb_connection_url"
JWT_SECRET="your_jwt_secret_key"
PORT=8000
CLOUDINARY_CLOUD_NAME="cloud_name"
CLOUDINARY_API_KEY="api_key"
CLOUDINARY_API_SECRET="api_secret"

```

### Run the backend:

```
npm run start:dev
```

### Setup Frontend

```
cd client
npm install
```

### Create a .env file inside the client folder:

```
VITE_API_URL=http://localhost:8000/api

```

### Run the frontend:

```
npm run dev
```


