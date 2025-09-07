
# JNTUGV Certification System

This is a **full-stack certification registration system** built with
**React + Node.js + Express + MongoDB**.

It includes: - Student registration form (with file upload). - Admin
authentication and dashboard. - Certificate generation (PDF). - Success
and 404 pages. - Modern UI with Tailwind CSS.

------------------------------------------------------------------------

## 🚀 Features

-   Student can register for a course.
-   Admin login with JWT authentication.
-   Admin can view all registrations, approve them, and generate PDF
    certificates.
-   File upload support.
-   Custom 404 Not Found page.

------------------------------------------------------------------------

## 📂 Folder Structure

    jntugv_cert_fullstack/
    │── backend/                # Express + MongoDB backend
    │   ├── models/             # Mongoose schemas
    │   ├── routes/             # API routes
    │   ├── controllers/        # Business logic
    │   ├── uploads/            # File uploads
    │   ├── server.js           # Entry point
    │── frontend/               # React frontend
    │   ├── src/
    │   │   ├── components/     # Navbar, Forms, etc.
    │   │   ├── pages/          # Website, RegisterForm, Admin, etc.
    │   │   ├── App.jsx         # Main routing file
    │   ├── package.json
    │── README.md               # Documentation

------------------------------------------------------------------------

## ⚙️ Setup Instructions

### 1. Clone & Extract

Download the project zip and extract it:

``` bash
unzip jntugv_cert_fullstack.zip
cd jntugv_cert_fullstack
```

### 2. Backend Setup

``` bash
cd backend
npm install
```

-   Create a `.env` file in `backend/` with:

```{=html}
<!-- -->
```
    MONGO_URI=mongodb://localhost:27017/jntugv_certification
    JWT_SECRET=your_secret_key
    PORT=5000

-   Run backend server:

``` bash
npm start
```

Server runs on <http://localhost:5000>.

### 3. Frontend Setup

Open a new terminal:

``` bash
cd frontend
npm install
npm run dev
```

Frontend runs on <http://localhost:5173>.

------------------------------------------------------------------------

## 🧪 Testing Flow

1.  Open **Home Page** → click "Register".
2.  Fill out the registration form and submit.
3.  Admin logs in at `/admin-login`.
4.  Admin views all registrations, approves, and generates certificates.

------------------------------------------------------------------------

## 🛠️ Future Improvements

-   Deploy to **Vercel (frontend)** + **Render/Heroku (backend)**.
-   Add **email notifications** on approval.
-   Store files in **AWS S3 or Firebase Storage**.
-   Enhance Admin Dashboard UI.

------------------------------------------------------------------------
=======

