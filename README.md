# 🏥 Docify - Telemedicine & Virtual Healthcare Platform

Docify is a full-stack telemedicine platform designed to bridge the gap between patients and healthcare professionals through secure online consultations, appointment management, medical report sharing, and subscription-based video consultations.

Built with modern web technologies, Docify provides role-based access for Patients, Doctors, and Administrators while ensuring secure authentication, scalable architecture, and seamless user experience.

---

## 🚀 Live Demo

**Frontend:** [https://docify-telemedical-web.vercel.app/]

**Backend API:** [https://docify-telemedical-web-1.onrender.com]

---

## 📌 Features

### 👨‍⚕️ Patient Features

* Secure Registration & Login
* JWT-Based Authentication
* Search and Select Doctors
* Book Online & Offline Appointments
* View Appointment Status
* Upload Medical Reports
* Access Shared Prescriptions
* Subscription-Based Video Consultations
* Razorpay Payment Integration
* Personalized Dashboard

### 🩺 Doctor Features

* Secure Doctor Authentication
* Doctor Dashboard
* Manage Appointments
* Confirm or Cancel Bookings
* View Patient Reports
* Upload Prescriptions
* Start Video Consultations
* Profile Management

### 🛠️ Admin Features

* Manage Users
* Manage Doctors
* Monitor Appointments
* Role-Based Access Control
* Platform Administration

---

## 🔐 Authentication & Security

* JWT Authentication
* Protected Routes
* Role-Based Access Control (RBAC)
* Secure Password Storage
* Environment Variable Configuration
* API Authorization Middleware

---

## 💳 Payment System

Docify integrates Razorpay to support subscription-based online consultations.

### Supported Workflow

1. Patient chooses consultation plan
2. Razorpay order is generated
3. Secure payment processing
4. Payment verification
5. Subscription activation
6. Access to video consultation features

---

## 📂 Medical Report Management

Patients can:

* Upload Reports
* View Uploaded Reports
* Share Reports with Doctors

Doctors can:

* Access Reports of Assigned Patients
* Upload Prescriptions
* Maintain Consultation Records

---

## 🎥 Telemedicine Module

Docify enables virtual healthcare consultations through video conferencing integration.

Features:

* Online Consultation Rooms
* Doctor-Patient Connectivity
* Appointment-Based Access
* Secure Session Management

---

## 🏗️ System Architecture

Frontend (React.js)
↓
REST APIs
↓
Node.js + Express.js
↓
MongoDB Atlas

Authentication → JWT

Payments → Razorpay

Deployment → Vercel + Render

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Context API
* Tailwind CSS
* React Icons

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js
* Mongoose

### Database

* MongoDB Atlas

### Payment Gateway

* Razorpay

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 📁 Project Structure

```text
docify/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── database/
│   ├── models/
│   └── server.js
│
└── README.md
```

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_key

RAZORPAY_KEY_SECRET=your_secret

CLIENT_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Local Installation

### Clone Repository

```bash
git clone https://github.com/krizz2005/docify-telemedical-web.git
cd docify
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm start
```

---

## 📊 Key Highlights

* Full-Stack MERN Application
* JWT Authentication & Authorization
* Role-Based Dashboards
* Razorpay Payment Integration
* MongoDB Database Design
* Medical Report Sharing
* Video Consultation Support
* Production Deployment Ready

---

## 🎯 Future Enhancements

* AI Health Assistant
* E-Prescription Generation
* Appointment Reminders
* Email Notifications
* Doctor Availability Scheduling
* Analytics Dashboard
* Multi-Language Support
* Mobile Application

---

## 👨‍💻 Author

Krish Nanda

Aspiring Full Stack Developer passionate about building scalable healthcare and enterprise applications using the MERN stack.

GitHub: https://github.com/krizz2005

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub. It helps showcase the project and supports future development.
