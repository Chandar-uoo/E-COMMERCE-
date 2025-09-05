

# 🛠️  Retailx E-Commerce Backend (Node.js + Express)

This is the backend for the E-Commerce web application. It provides RESTful APIs for user authentication, product management, cart operations, order handling, and admin functionalities.

---

## 🚀 Features

## 🚀 Features  

### 🔐 Authentication  
- Login, Signup, JWT Access + Refresh Tokens  
- Email verification (OTP on signup)  
- Role-Based Access Control (User / Admin)  

### 👤 User Management  
- Profile update, Password change  
- Admin: View/Search all users  

### 🛍️ Products  
- Users: View & Filter Products  
- Admin: Create, Update, Delete Products  

### 🛒 Cart  
- Add / Update / Remove Items from Cart  
- Auto-sync with backend  

### 📦 Orders  
- Users: Place Orders, Simulated Payment (Cash / NetBanking)  
- Email proof sent after payment  
- Admin: Update order status (Processing → Shipped → Delivered)  

### 📊 Admin Dashboard  
- Manage Products  
- Manage Users  
- Manage Orders  
- Ready for analytics/stats  

👉 **Admin-only actions**: Add/Update/Delete Product, Fetch All Users, Update Order Status  
👉 **User actions**: Browse Products, Manage Cart, Place Orders, Make Payments, Verify Email  

---

## ⚙️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (Access + Refresh Tokens)
- **Validation**: express-validator
- **Security**: CORS, Helmet, Rate Limiting
- **Others**: dotenv, Morgan (logs), custom middleware

---

## 📁 Project Structure

```

ecommerce-backend/
│
├── controllers/      # Route logic for auth, users, products, cart, orders
├── models/           # Mongoose schemas
├── routes/           # All API routes
├── services/         # Business logic between controller and DB
├── middleware/       # Auth, error, validators, RBAC
├── utils/            # Token utils, error classes, config
├── .env              # Environment variables (not pushed)
├── server.js         # Entry point
└── README.md         # You're here!

```

---

## 🔐 Environment Variables (`.env`)

Create a `.env` file at the root of your backend project:

```

PORT=3000
MONGODB\_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce
JWT\_SECRET=your\_jwt\_secret
REFRESH\_SECRET=your\_refresh\_token\_secret
FRONTEND\_URL=[http://localhost:5173](http://localhost:5173)

````

> 🔐 **Important:** Never push `.env` to GitHub. Add it to `.gitignore`.

---

## 📦 Setup & Run

```bash
# 1. Clone the repo
git clone https://github.com/Chandar-uoo/E-COMMERCE-
cd ecommerce-backend

# 2. Install dependencies
npm install

# 3. Create .env file (see above)

# 4. Run the server
npm run dev
````

---

## 📮 API Documentation

Use Postman or Thunder Client to explore the APIs.
✔️ Organized into folders (Auth, Products, Cart, Orders, Admin)

> 📑 Coming Soon: Public Postman Documentation Link

---

## 🗓 Versioning

**Version**: `v1.0.0`
**Status**: ✅ MVP Completed (Stable)
**Last Updated**: August 2025

---

## 📈 Planned Features

* [ ] 🔄 Stripe or Razorpay Payment Integration
* [ ] 📦 Inventory Management
* [ ] 🔐 Add email verification, password update

---

## 🧑‍💻 Author

**Chandru V**
📧 [chandruofficial666@gmail.com](mailto:chandruofficial666@gmail.com)
🌐 GitHub: [@Chandar-uoo](https://github.com/Chandar-uoo)

---

> ⭐ If you find this helpful, give a star and feel free to contribute!

```

---
.
```
