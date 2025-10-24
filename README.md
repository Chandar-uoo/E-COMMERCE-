
# 🛠️ RetailX E-Commerce Backend (Node.js + Express)

**RetailX Backend** powers the e-commerce application with **RESTful APIs** for authentication, product management, cart & orders, and admin functionalities.

---

## 🚀 Features

### 🔐 Authentication

* 📝 **Signup & Login**: JWT-based authentication with access & refresh tokens
* 📧 **Email Verification**: OTP-based verification during signup
* 🔄 **Token Refresh**: Automatic access token renewal using refresh tokens
* 🚪 **Secure Logout**: Cookie-based session management

### 👤 User Management

* 🧑‍💻 **Profile Management**: Update name, DOB, address, phone, image
* 🔑 **Password Update**: Change password securely with old password verification
* 📨 **Email Verification**: Send & verify OTP for email confirmation
* 🛡️ **Admin Access**: View/search all users with pagination

### 🛍️ Products

* 🔍 **Browse Products**: Filter by category, brand, tags, price range, stock
* 🧐 **Search**: Regex search across title, brand, category
* 📊 **Sorting**: Price, popularity (sold count), latest
* ⭐ **Product Reviews**: Users can rate and comment on products
* 👨‍💼 **Admin Controls**: Add, update, soft-delete products, fetch with advanced filters

### 🛒 Cart

* ➕ **Add to Cart**: Auto price calculation
* 🛒 **Read Cart**: View cart items with details
* 🔄 **Update Quantity**: Modify item quantities
* ❌ **Remove Items**: Delete products from cart
* 🗑️ **Clear Cart**: Empty entire cart

### 📦 Orders

* 📝 **Create Orders**: Razorpay payment integration
* 💳 **Payment Processing**:

  * Razorpay checkout integration
  * Webhook verification for confirmation
  * Inventory auto-update on successful payment
* 👨‍💼 **Admin Order Management**:

  * Fetch orders by status
  * Update order status
  * View detailed order info

### 📊 Admin Dashboard

* 📈 **Overview Stats**:

  * Total products
  * Top 3 best-selling products
  * Total revenue
  * Pending orders count
  * Total customers
* 📊 **Analytics Ready**: Structured data for dashboards

### 🔒 Security Features

* 🛡️ **Helmet**: Security headers
* 🌐 **CORS**: Frontend-origin allowed with credentials
* ⏱️ **Rate Limiting**: 1000 requests/15min/IP
* 🔐 **JWT Validation**: Secure routes
* 🛡️ **RBAC**: Admin/User role separation
* ✅ **Input Validation**: Comprehensive input checks
* 🔑 **Password Hashing**: bcrypt

### 🤖 Automation

* ⏰ **Cron Jobs**: Cleanup unpaid orders after 10 minutes

---

## ⚙️ Tech Stack

| Technology                      | Purpose          |
| ------------------------------- | ---------------- |
| Node.js + Express.js v5.1.0     | Backend          |
| MongoDB + Mongoose              | Database         |
| JWT (Access + Refresh)          | Authentication   |
| Razorpay                        | Payment Gateway  |
| Nodemailer                      | Email service    |
| Validator.js + Middleware       | Input validation |
| Helmet + CORS + Rate Limit      | Security         |
| Cron                            | Job Scheduling   |
| dotenv, bcryptjs, cookie-parser | Utilities        |

---

## 📁 Project Structure

```
ecommerce-backend/
│
├── controllers/      # Auth, users, products, cart, orders logic
├── models/           # Mongoose schemas
├── routes/           # API routes
├── services/         # Business logic
├── middleware/       # Auth, validators, RBAC, error handling
├── utils/            # Token utils, error classes, config
├── .env              # Environment variables
├── server.js         # Entry point
└── README.md         # Documentation
```

---

## 🔐 Environment Variables (`.env`)

```env
# Server
PORT=3000

# Database
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce

# JWT
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret
JWT_SECRET=your_jwt_secret

# Frontend
FRONTEND_URL=https://retailx666.netlify.app

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

> 🔒 Never push `.env` to GitHub — add it to `.gitignore`.

---

## 📦 Setup & Run

```bash
# Clone
git clone https://github.com/Chandar-uoo/E-COMMERCE-
cd ecommerce-backend

# Install dependencies
npm install

# Create .env file

# Start server
npm start
```

Server runs on `http://localhost:3000`

---

## 📮 API Documentation

### 🔐 Authentication (`/api/auth`)

* `POST /signup` - Register user (email OTP)
* `POST /login` - Login user
* `GET /logout` - Logout
* `GET /refresh-token` - Renew access token

### 👤 User (`/api/user`)

* `GET /user-check` - Current user details
* `PATCH /update-user` - Update profile
* `PATCH /update-password` - Change password
* `POST /send-verification-otp` - Send OTP
* `POST /verify-otp` - Verify OTP

### 🛍️ Product (`/api/product`)

* `GET /` - Get all products
* `GET /search-product` - Search & filter
* `GET /:id` - Single product with reviews
* `POST /review/:id` - Add review

### 🛒 Cart (`/api/cart`)

* `POST /add` - Add item
* `GET /read` - View cart
* `PATCH /update` - Update quantity
* `DELETE /delete` - Remove item
* `DELETE /clear` - Clear cart

### 📦 Orders (`/api/order`)

* `GET /read` - User order history
* `POST /process` - Create order
* `POST /payment/webhook` - Razorpay webhook

### 👨‍💼 Admin (`/api/admin`)

* **Dashboard**: `GET /admin-dash-board`
* **Products**: `GET /product`, `POST /product/add-product`, `PATCH /product/update-product`, `DELETE /product/delete-product/:id`
* **Orders**: `GET /order`, `PATCH /order/update-order-status/:id`
* **Users**: `GET /user`

---

## 🔑 API Authentication

Include **access token** in request header:

```
Authorization: Bearer <your_access_token>
```

Admin routes require role `"admin"`.

---

## 💳 Payment Flow

1. User creates order → backend generates Razorpay order
2. Frontend displays Razorpay checkout
3. User completes payment
4. Razorpay webhook hits `/api/order/payment/webhook`
5. Backend verifies signature
6. On success:

   * Order marked **paid**
   * Inventory updated
   * Transaction recorded
 

---

## 🗓 Versioning

* **v1.2.0** — MVP Completed ✅
* Last Updated: October 2025

---

## 📈 Planned Features

* 🔄 Enhanced payment process
* 📦 Inventory management + low-stock alerts
* 📊 Extended admin analytics
* 🔍 Product recommendation system

---

## 🧑‍💻 Author

**Chandru V**
📧 [chandruofficial666@gmail.com](mailto:chandruofficial666@gmail.com)
🌐 GitHub: [@Chandar-uoo](https://github.com/Chandar-uoo)

---

## 📄 License

ISC License

---

> ⭐ If you find this helpful, give a star & contribute!

---


