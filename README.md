<h1 align="center" style="color:#16A34A; font-size: 44px;">
🎟️ Smart Attendance Management System – Technical Fest
</h1>

<h3 align="center" style="color:gray;">
A real-time QR-based attendance tracking system built using the MERN stack to manage student and audience participation efficiently during college technical fests.
</h3>

<p align="center">
  <a href="https://crossroads-attendence.netlify.app/scan"><b>🌐 Live Website</b></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Email-Nodemailer-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Realtime-Live%20Dashboard-success?style=for-the-badge" />
</p>

<hr>

<h2>📚 Table of Contents</h2>
<ul>
  <li><a href="#about">About the System</a></li>
  <li><a href="#problem">Problem Statement</a></li>
  <li><a href="#workflow">System Workflow</a></li>
  <li><a href="#features">Core Features</a></li>
  <li><a href="#architecture">System Architecture</a></li>
  <li><a href="#structure">Project Structure</a></li>
  <li><a href="#env">Environment Variables</a></li>
  <li><a href="#scripts">Available Scripts</a></li>
  <li><a href="#roles">User Roles</a></li>
  <li><a href="#tech">Tech Stack</a></li>
  <li><a href="#database">Database Design</a></li>
  <li><a href="#security">Security Features</a></li>
  <li><a href="#performance">Performance Optimization</a></li>
  <li><a href="#future">Future Enhancements</a></li>
  <li><a href="#screenshots">Screenshots</a></li>
  <li><a href="#creator">Creator</a></li>
</ul>

<hr>

<h2 id="about">🧭 About the System</h2>

<p>
The Smart Attendance Management System is a digital solution designed to replace traditional manual attendance methods during technical fests.
</p>

<p>
Using QR-based check-in and Student ID validation, the platform ensures fast, secure, and accurate attendance marking. It provides real-time dashboard updates, automated email confirmations, and separate tracking for registered students and on-spot audience registrations.
</p>

<p>
The system reduces human error, prevents duplicate entries, and enables organizers to monitor participation live.
</p>

<hr>

<h2 id="problem">❗ Problem Statement</h2>

<ul>
<li>Manual attendance sheets are slow and error-prone</li>
<li>Proxy attendance is difficult to detect</li>
<li>No real-time participation monitoring</li>
<li>Hard to manage walk-in audience data</li>
<li>No instant confirmation mechanism</li>
</ul>

<p>
This system solves these problems using automation, validation logic, and real-time analytics.
</p>

<hr>

<h2 id="workflow">🔄 System Workflow</h2>

<ol>
<li>Admin logs into secure dashboard</li>
<li>QR code displayed at event entry</li>
<li>User scans QR code</li>
<li>Selects:
  <ul>
    <li>Registered Student</li>
    <li>Not Registered (Audience)</li>
  </ul>
</li>
<li>Student enters Student ID</li>
<li>System verifies ID from database</li>
<li>Attendance marked & duplicate check performed</li>
<li>Email confirmation sent to Team Leader</li>
<li>Dashboard updates instantly</li>
</ol>

<hr>

<h2 id="features">✨ Core Features</h2>

<ul>
<li>📱 QR-Based Smart Check-In</li>
<li>🆔 Student ID Validation</li>
<li>📊 Real-Time Attendance Counter</li>
<li>📧 Automated Email Confirmation</li>
<li>👥 Separate Registered & Audience Tracking</li>
<li>📂 Excel Bulk Student Upload</li>
<li>➕ Manual Entry Option</li>
<li>🔐 Secure Admin Authentication</li>
<li>📈 Live Dashboard Analytics</li>
<li>🚫 Duplicate Attendance Prevention</li>
</ul>

<hr>

<h2 id="architecture">🏗️ System Architecture</h2>

<p>
Frontend (React) communicates with Backend (Express API). Backend handles authentication, validation logic, database operations, and email services. MongoDB stores student, attendance, and audience records.
</p>

<pre>
User → QR Scan → React Frontend → Express API → MongoDB
                                     ↓
                               Nodemailer Service
                                     ↓
                                Admin Dashboard
</pre>

<hr>
<pre>
CROSSROADS-2026/
├── FRONTEND/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── Teams/
│   │   ├── components/
│   │   │   ├── AddStudent.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AudienceList.jsx
│   │   │   ├── AudienceRegistration.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PresentStudents.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── QRLanding.jsx
│   │   │   ├── RegisteredStudent.jsx
│   │   │   ├── StudentCheckIn.jsx
│   │   │   ├── Volenter.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── netlify.toml
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│
├── BACKEND/
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── audienceController.js
│   │   ├── studentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   ├── models/
│   │   ├── RegisteredStudent.js
│   │   ├── Admin.js
│   │   ├── Audience.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── audienceRoutes.js
│   │   ├── studentRoutes.js
│   ├── utils/
│   │   ├── emailService.js
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
</pre>

<hr>
<h2 id="env">🔐 Environment Variables</h2>
<table border="1" cellpadding="8">
<tr><th>File</th><th>Variable</th><th>Description</th></tr>
<tr><td>Backend</td><td>MONGO_URI</td><td>MongoDB database connection string</td></tr>
<tr><td>Backend</td><td>JWT_SECRET</td><td>Secret key used to sign and verify admin authentication tokens</td></tr>
<tr><td>Backend</td><td>EMAIL_USER</td><td>Email address used to send registration confirmation emails</td></tr>
<tr><td>Backend</td><td>EMAIL_PASS</td><td>Email account password or app-specific password for Nodemailer</td></tr>
<tr><td>Backend</td><td>PORT</td><td>Port number on which the backend server runs</td></tr>
<tr><td>Backend</td><td>ADMIN_EMAIL</td><td>Username used for admin panel login</td></tr>
<tr><td>Backend</td><td>ADMIN_PASSWORD</td><td>Password used for admin panel login (should be securely stored)</td></tr>
<tr><td>Frontend</td><td>VITE_BACKEND_URL</td><td>Base URL of the backend API used by the frontend</td></tr>

</table>


<hr>

<h2 id="scripts">📜 Available Scripts</h2>
<table border="1" cellpadding="8">
<tr><th>Command</th><th>Description</th></tr>
<tr><td>npm run dev</td><td>Start frontend dev server</td></tr>
<tr><td>npm run build</td><td>Build frontend for production</td></tr>
<tr><td>npm start</td><td>Run backend server</td></tr>
</table>

<hr>

<h2 id="roles">👥 User Roles</h2>

<table border="1" cellpadding="8">
<tr><th>Role</th><th>Access</th></tr>
<tr><td>Registered Student</td><td>Verify ID & Mark Attendance</td></tr>
<tr><td>Audience</td><td>On-Spot Registration</td></tr>
<tr><td>Admin</td><td>Dashboard, Manage & Export Data</td></tr>
<tr><td>Volunteer </td><td>Dashboard, Manage Data</td></tr>
</table>

<hr>

<h2 id="tech">🧰 Tech Stack</h2>

<table border="1" cellpadding="8">
<tr><th>Layer</th><th>Technology</th></tr>
<tr><td>Frontend</td><td>React, Vite, Tailwind CSS</td></tr>
<tr><td>Backend</td><td>Node.js, Express.js</td></tr>
<tr><td>Database</td><td>MongoDB with Mongoose</td></tr>
<tr><td>Authentication</td><td>JWT</td></tr>
<tr><td>Email</td><td>Nodemailer</td></tr>
<tr><td>File Upload</td><td>Multer</td></tr>
<tr><td>Excel Handling</td><td>ExcelJS / xlsx</td></tr>
</table>

<hr>

<h2 id="database">🗄️ Database Design</h2>

<ul>
<li><b>Student Collection:</b> studentId, name, email, team, department</li>
<li><b>Attendance Collection:</b> studentId, timestamp, status</li>
<li><b>Audience Collection:</b> name, email, phone, timestamp</li>
</ul>

<p>
Attendance marking checks if a student ID already exists in the Attendance collection to prevent duplicate entries.
</p>

<hr>

<h2 id="security">🔐 Security Features</h2>

<ul>
<li>JWT-Based Admin Authentication</li>
<li>Protected Dashboard Routes</li>
<li>Duplicate Entry Prevention Logic</li>
<li>Server-Side Validation</li>
<li>Environment Variable Protection</li>
<li>Password Not Hardcoded</li>
</ul>

<hr>

<h2 id="performance">⚡ Performance Optimizations</h2>

<ul>
<li>Optimized React Components</li>
<li>Efficient API Calls</li>
<li>Fast Build via Vite</li>
<li>Indexed Student ID for Fast Lookup</li>
<li>Minimal Payload API Responses</li>
</ul>

<hr>

<h2 id="future">🚀 Future Enhancements</h2>

<ul>
<li>📍 Geo-location Validation</li>
<li>📸 Face Verification Integration</li>
<li>📊 Advanced Heatmap Analytics</li>
<li>📜 Auto Certificate Generation</li>
<li>👥 Role-Based Multi-Admin System</li>
<li>📱 Progressive Web App (PWA)</li>
<li>🧠 AI-Based Crowd Prediction</li>
</ul>

<hr>

<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 id="screenshots" style="color: #16A34A; font-size: 28px; font-weight: bold; margin-bottom: 20px;">📸 Screenshots</h2>
   <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
    Explore the Smart Attendance System interface including QR verification flow, admin dashboard, student validation system, and real-time analytics panel.
</p>
    <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
        <div style="flex: 1 1 280px; padding: 15px; border: 1px solid #ddd;">
            <h3>🏠 Home / QR Landing Page</h3>
            <img src="https://res.cloudinary.com/dgtyqhtor/image/upload/v1771730380/Screenshot_2026-02-22_084428_uvns96.png" style="max-width: 100%;">
        </div>
        <div style="flex: 1 1 280px; padding: 15px; border: 1px solid #ddd;">
            <h3>🆔 Student Verification Page</h3>
            <img src="https://res.cloudinary.com/dgtyqhtor/image/upload/v1771730380/Screenshot_2026-02-22_084521_ogosbw.png" style="max-width: 100%;">
        </div>
        <div style="flex: 1 1 280px; padding: 15px; border: 1px solid #ddd;">
            <h3>👥 Audience Registration</h3>
            <img src="https://res.cloudinary.com/dgtyqhtor/image/upload/v1771730380/Screenshot_2026-02-22_084723_jh6wz8.png" style="max-width: 100%;">
        </div>
        <div style="flex: 1 1 280px; padding: 15px; border: 1px solid #ddd;">
            <h3>📊 Admin Dashboard</h3>
            <img src="https://res.cloudinary.com/dgtyqhtor/image/upload/v1771730380/Screenshot_2026-02-22_084739_ebtarx.png" style="max-width: 100%;">
        </div>
        <div style="flex: 1 1 280px; padding: 15px; border: 1px solid #ddd;">
            <h3>📂 Excel Upload System</h3>
            <img src="https://res.cloudinary.com/dgtyqhtor/image/upload/v1771730380/Screenshot_2026-02-22_084758_c7dkfl.png" style="max-width: 100%;">
        </div>
        <div style="flex: 1 1 280px; padding: 15px; border: 1px solid #ddd;">
            <h3>📧 Email Confirmation</h3>
            <img src="https://res.cloudinary.com/dgtyqhtor/image/upload/v1771730455/Screenshot_2026-02-22_084841_aiahbi.png" style="max-width: 100%;">
        </div>
    </div>
</div>

<hr>

<h2 id="creator" align="center" style="color:#16A34A; font-size:34px;">
👨‍💻 Built & Designed By
</h2>

<p align="center" style="font-size:22px; font-weight:bold;">
  Aman Gupta
</p>

<p align="center">
  Full Stack MERN Developer • Real-Time Systems Builder • Tech Enthusiast
</p>

<p align="center">
  🚀 Building practical digital solutions &nbsp; | &nbsp;
  💡 Focused on scalable architecture &nbsp; | &nbsp;
  🎯 Solving real-world problems through technology
</p>

<hr>

<p align="center">
  ⭐ If this project inspired you, consider starring the repository!
</p>