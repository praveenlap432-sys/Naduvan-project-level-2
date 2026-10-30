# Naduvan Industry — MERN E-commerce

A natural skincare e-commerce starter based on the requested UI.

## Features
- React + Vite frontend
- Express + MongoDB backend
- Admin-only JWT authentication
- Admin dashboard to view customer orders
- Customer checkout without customer login
- Product listing and product detail pages
- Cart stored in browser localStorage
- Order creation with customer name, phone, email, address and items
- Responsive green/cream skincare UI
- No star ratings on product cards
- No discount badges on product cards
- Gallery in navbar
- "Just Landed" removed

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI` in `.env`.

Default admin seed:
- Email: admin@naduvan.com
- Password: Admin@123

The admin is automatically created on backend startup if it does not exist.

Backend runs on `http://localhost:5000`.

## 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## 3. Admin

Open:

`http://localhost:5173/admin/login`

Login with the default admin credentials above.

Admin dashboard shows:
- Total orders
- Total customers/orders
- Total sales
- Recent orders
- Full customer/order details
- Order status update

## MongoDB Atlas

Create a MongoDB Atlas database and put the connection string in:

`backend/.env`

Example:

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/naduvan
JWT_SECRET=change-this-secret
ADMIN_EMAIL=admin@naduvan.com
ADMIN_PASSWORD=Admin@123
```

## Product media & pricing update
- Products support up to 4 image URLs (front/back/side/detail).
- Each size/ML/L variant supports buying price, original/MRP price and offer/selling price.
- Shop shows an image slider, size dropdown, struck original price and offer price.
- Admin product cards show Buying / Selling / Profit for the first variant.
- Add a product Video URL in Admin Products; enabled product videos automatically appear in Gallery.
- Copy `backend/.env.example` to `backend/.env` and set your MongoDB/JWT values before running the backend.


## Deployment configuration (frontend)
Create a `frontend/.env` file in your local/deployment environment and set `VITE_API_URL` to the deployed backend API base URL, including `/api` (example: `https://api.example.com/api`). The repository includes `frontend/.env.example` as a template. Configure `CLIENT_URL` in the backend hosting environment to your frontend origin (multiple origins may be comma-separated). Do not commit actual credentials. Vite environment variables are read at build time, so rebuild the frontend after changing the URL.

## Customer accounts and orders
Customers register/sign in at `/account`. Checkout requires a customer account. Each new order is linked to the signed-in customer, receives an order number, and displays an estimated delivery date five days after order placement. Customers can see their order history and order details from their profile.

## SMS notifications
Order and order-status SMS notifications use Twilio when the following environment variables are configured in the hosting platform (the existing `.env` files were not changed): `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER`. Use a Twilio-enabled sender and ensure your provider/account permits sending to the customer's country. Without these settings, orders still work but no SMS is sent.

## Payment status
Online checkout is intentionally disabled until a verified payment flow is configured. Cash on Delivery is available. Sales reports count COD revenue only when the order is marked Delivered; paid online orders count when payment status is Paid.
