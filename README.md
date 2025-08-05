"# Smart-Restaurant-Bar-Management-System" 
# 🍽️ Restaurant Management System - Backend

This is the backend API for the Restaurant Management System, built using **Node.js**, **Express**, and **MongoDB**. It supports features such as order management, table reservations, menu items, admin dashboard analytics, and more.

---

## 🚀 Features

- Admin dashboard summary and statistics
- Menu item management (CRUD)
- Table management (CRUD)
- Order creation and status update
- Authentication with JWT
- Role-based access control (admin/user)
- Secure REST APIs
- MongoDB database integration

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (for image upload)
- dotenv

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/restaurant-backend.git
cd restaurant-backend

npm install

touch .env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

npm run dev

.
├── controllers/
│   ├── auth.controller.js
│   ├── menu.controller.js
│   ├── table.controller.js
│   ├── order.controller.js
│   └── admin.controller.js
├── models/
├── routes/
├── middleware/
├── uploads/ (images stored here)
├── .env
├── .gitignore
├── package.json
└── server.js

```
📚 Admin API Endpoints
🧾 Auth Routes
Method	Endpoint	Description
POST	/api/auth/register	Register a new user (admin only)
POST	/api/auth/login	Login and receive JWT token


🧠 Admin Dashboard
Method	Endpoint	Description
GET	/api/admin/summary	Full summary of orders, revenue, etc.
GET	/api/admin/stats	Quick stats: pending, served, etc.

🍽️ Menu Item Management
Method	Endpoint	Description
GET	/api/menu	Get all menu items
POST	/api/menu	Add a new item (with image)
PUT	/api/menu/:id	Update an item
DELETE	/api/menu/:id	Delete an item

📦 Image must be uploaded using multipart/form-data under key image.


🪑 Table Management
Method	Endpoint	Description
GET	/api/tables	Get all tables
POST	/api/tables	Add a new table
PUT	/api/tables/:id	Update table
DELETE	/api/tables/:id	Delete table
GET	/api/tables/status/:status	Get tables by status (available/busy)

🧾 Orders
Method	Endpoint	Description
GET	/api/orders	List all orders
POST	/api/orders	Create new order
PUT	/api/orders/:id/status	Update order status
DELETE	/api/orders/:id	Cancel/Delete order
