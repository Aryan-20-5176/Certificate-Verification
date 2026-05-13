# 📌 Project Title:
Certificate Verification System

## 👨‍💻 Project Overview
The **Certificate Verification System** is a robust full-stack application designed to manage, issue, and verify digital certificates. It streamlines the process for organizations to upload student data and for students to securely access and verify their credentials.

This system ensures the authenticity of certificates, preventing fraud through a unique identification and verification mechanism.

---

## 🧩 Key Features

### 🎓 Students
- **Search & View:** Easily find certificates using a unique Certificate ID.
- **Download:** Access and download digital copies of earned certificates.
- **Profile Management:** View personal internship details and issued credentials.

### 🛡️ Admin Panel
- **Bulk Upload:** Upload student data via Excel files for automated certificate generation.
- **Certificate Management:** Create, update, or revoke certificates.
- **Dashboard:** Monitor total issued certificates and platform activity.
- **Security:** Manage student access and ensure data integrity.
- **Email Automation:** Automatically sends email notifications to students upon certificate issuance with their unique ID.

### 🔍 Verification System (Public)
- **Instant Validation:** Verify the authenticity of any certificate using the `Certificate ID`.
- **Detail Extraction:** View student name, domain, and duration directly from the secure database.

---

---

## 🛠 Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **File Handling:** `xlsx` (Excel processing), `multer` (File uploads)
- **Authentication:** JWT (JSON Web Tokens), Bcrypt.js
- **State Management:** Context API

---

## 📁 Project Structure
- `backend/` → Node.js & Express API
  - `src/models/` → Mongoose Schemas (User, Certificate)
  - `src/routes/` → API Endpoints
  - `uploads/` → Temporary storage for Excel uploads
- `frontend/` → React + Vite UI
  - `src/pages/` → Application views (Home, Dashboard, CertificateView)
  - `src/components/` → Reusable UI components (Navbar, Footer)
- `.env.example` → Template for environment variables

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

git clone: https://github.com/Aryan-20-5176/Certificate-Verification.git
```
cd "Certificate verification system"
```

### 2️⃣ Backend Configuration
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# Email Configuration (Nodemailer)
EMAIL_SERVICE=Gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```
- Start the backend:
```bash
npm start
```

### 3️⃣ Frontend Configuration
```bash
cd ../frontend
npm install
npm run dev
```
- The app will typically run on `http://localhost:5173`.

---

## 🚀 Unique Selling Point (USP):

**Automated Excel-to-Email Workflow:** 
Instead of manual entry, admins can upload a single Excel sheet to issue hundreds of certificates instantly. The system automatically triggers a personalized email to each student, delivering their unique Certificate ID and a direct verification link, ensuring a seamless experience.

---

## 👨‍💻 Author
**Aryan**
