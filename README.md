<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>

  <h1>🍽️ Smart Restaurant & Bar Management System - Backend</h1>

  <p>This is the backend API for the Restaurant Management System, built using <strong>Node.js</strong>, <strong>Express</strong>, and <strong>MongoDB</strong>. It supports features such as order management, table reservations, menu items, admin dashboard analytics, and more.</p>

  <h2>🚀 Features</h2>
  <ul>
    <li>Admin dashboard summary and statistics</li>
    <li>Menu item management (CRUD)</li>
    <li>Table management (CRUD)</li>
    <li>Order creation and status update</li>
    <li>Authentication with JWT</li>
    <li>Role-based access control (admin/user)</li>
    <li>Secure REST APIs</li>
    <li>MongoDB database integration</li>
  </ul>

  <h2>🛠️ Tech Stack</h2>
  <ul>
    <li>Node.js</li>
    <li>Express.js</li>
    <li>MongoDB + Mongoose</li>
    <li>JWT Authentication</li>
    <li>Multer (for image upload)</li>
    <li>dotenv</li>
  </ul>

  <h2>⚙️ Installation</h2>
  <pre><code>git clone https://github.com/your-username/restaurant-backend.git
cd restaurant-backend
npm install
touch .env</code></pre>

  <p>Add the following to <code>.env</code> file:</p>
  <pre><code>PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret</code></pre>

  <p>Run the server:</p>
  <pre><code>npm run dev</code></pre>

  <h2>📁 Project Structure</h2>
  <pre><code>.
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
└── server.js</code></pre>

  <h2>📚 Admin API Endpoints</h2>

  <h3>🧾 Auth Routes</h3>
  <table>
    <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
    <tr><td>POST</td><td>/api/auth/register</td><td>Register a new user (admin only)</td></tr>
    <tr><td>POST</td><td>/api/auth/login</td><td>Login and receive JWT token</td></tr>
  </table>

  <h3>🧠 Admin Dashboard</h3>
  <table>
    <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
    <tr><td>GET</td><td>/api/admin/summary</td><td>Full summary of orders, revenue, etc.</td></tr>
    <tr><td>GET</td><td>/api/admin/stats</td><td>Quick stats: pending, served, etc.</td></tr>
  </table>

  <h3>🍽️ Menu Item Management</h3>
  <table>
    <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
    <tr><td>GET</td><td>/api/menu</td><td>Get all menu items</td></tr>
    <tr><td>POST</td><td>/api/menu</td><td>Add a new item (with image)</td></tr>
    <tr><td>PUT</td><td>/api/menu/:id</td><td>Update an item</td></tr>
    <tr><td>DELETE</td><td>/api/menu/:id</td><td>Delete an item</td></tr>
  </table>

  <p><strong>Note:</strong> Image must be uploaded using <code>multipart/form-data</code> under key <code>image</code>.</p>

  <h3>🪑 Table Management</h3>
  <table>
    <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
    <tr><td>GET</td><td>/api/tables</td><td>Get all tables</td></tr>
    <tr><td>POST</td><td>/api/tables</td><td>Add a new table</td></tr>
    <tr><td>PUT</td><td>/api/tables/:id</td><td>Update table</td></tr>
    <tr><td>DELETE</td><td>/api/tables/:id</td><td>Delete table</td></tr>
    <tr><td>GET</td><td>/api/tables/status/:status</td><td>Get tables by status (available/busy)</td></tr>
  </table>

  <h3>🧾 Orders</h3>
  <table>
    <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
    <tr><td>GET</td><td>/api/orders</td><td>List all orders</td></tr>
    <tr><td>POST</td><td>/api/orders</td><td>Create new order</td></tr>
    <tr><td>PUT</td><td>/api/orders/:id/status</td><td>Update order status</td></tr>
    <tr><td>DELETE</td><td>/api/orders/:id</td><td>Cancel/Delete order</td></tr>
  </table>

  <h2>📌 Auth Header Format</h2>
  <p>Pass JWT token in headers like this:</p>
  <pre><code>Authorization: Bearer &lt;your_token&gt;</code></pre>

</body>
</html>
