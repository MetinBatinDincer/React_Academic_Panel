# Academic Panel Application

## Overview
This is a full-stack web application designed for academic job applications and evaluations. The system facilitates the entire process from job posting to candidate evaluation, involving multiple user roles including administrators, applicants, jury members, and managers.

## Features

### User Roles
- *Applicants*: Can view job announcements, submit applications with necessary documents, and check application status
- *Admin*: Manages job announcements, document requirements, and user accounts
- *Jury Members*: Evaluate applications based on predefined criteria
- *Managers*: Oversee the evaluation process and make final decisions

### Core Functionality
- User authentication and role-based access control
- Job announcement creation and management
- Document upload and verification
- Application submission and tracking
- Evaluation by jury members with scoring system
- Final review and decision-making by managers

## Technology Stack

### Frontend
- React 19
- React Router DOM 7
- Axios for API requests
- JWT for authentication
- PDF-lib for PDF manipulation
- Vite as build tool

### Backend
- Node.js with Express
- PostgreSQL database with Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- CORS for cross-origin resource sharing

## Project Structure
- /frontend: React application
  - /src: Source code
    - /Components: Reusable UI components
    - /pages: Application pages and views
    - /utils: Utility functions
    - /assets: Static assets
- /backend: Node.js server
  - /routes: API endpoints
  - /middlewares: Express middlewares
  - /db: Database models and configuration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database

### Installation

#### Backend Setup
1. Navigate to the backend directory:
   
   cd backend
   
2. Install dependencies:
   
   npm install
   
3. Start the server:
   
   node server.js
   
   The server will run on http://localhost:5000

#### Frontend Setup
1. Navigate to the frontend directory:
   
   cd frontend
   
2. Install dependencies:
   
   npm install
   
3. Start the development server:
   
   npm run dev
   
   The application will be available at http://localhost:5173

## API Endpoints

The backend provides the following main API endpoints:

- /api/auth: Authentication endpoints
- /api/users: User management
- /api/admin/ilanlar: Job announcement management (admin)
- /api/ilanlar: Public job announcement endpoints
- /api/basvurular: Application management
- /api/belgeler: Document management
- /api/belge_turleri: Document type management
- /api/juri-secim: Jury selection
- /api/atiflar: Citations management

## License
This project is proprietary and confidential.
