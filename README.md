# Nepmart - MERN Stack Ecommerce Platform

## 🌐 Live Demo
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Admin Panel:** [http://localhost:5174](http://localhost:5174)
- **Backend API:** [http://localhost:8000/api](http://localhost:8000/api)

## 📖 Description
Nepmart is a complete e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It features a customer-facing store, admin dashboard, and secure payment integration with eSewa.

## ✨ Features
- User authentication & authorization
- Product catalog with search/filter
- Shopping cart & wishlist
- Secure checkout with eSewa payment
- Order management system
- Admin dashboard for management
- Personalized recommendations
- Responsive design

## 🛠️ Tech Stack
- **Frontend:** React, Material-UI, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Payment:** eSewa API integration
- **Storage:** Cloudinary, Multer
- **Auth:** JWT, Bcrypt

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd "MERN stack Ecommerce Project"

# Install dependencies
npm install

# Setup environment variables
# Create .env file in server/
PORT=8000
MONGODB_URI=mongodb://localhost:27017/nepmart
JWT_SECRET=your_jwt_secret
ESEWA_MERCHANT_ID=EPAYTEST
ESEWA_SECRET=8gBm/:&EnhH.1/q

Running the Application
# Run all services (server, client, admin)
npm run dev

# Or run individually
npm run server    # Backend on port 8000
npm run client    # Frontend on port 5173
npm run admin     # Admin panel on port 5174