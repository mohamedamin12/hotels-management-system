# Hotel Management System

A comprehensive hotel management system built with Node.js, TypeScript, PostgreSQL, and various third-party integrations like Stripe for payments, Multer for file uploads, and Nodemailer for email handling. The system allows hotel admins to manage hotels, rooms, bookings, payments, and reviews. Users can create bookings, make payments, and leave reviews.

## Features

- **User Management**: Register, login, and password management with Google authentication and forgot password functionality.
- **Hotel Management**: Admin can create, update, and delete hotels.
- **Room Management**: Admin can create, update, and delete rooms; Users can view room details.
- **Booking Management**: Users can create, update, delete, and view bookings. Admins can manage all bookings.
- **Payment Management**: Cash and Stripe payment options. Admin can update payment status from pending to completed.
- **Review Management**: Users can create, update, and delete their own reviews. Admin can manage all reviews.
- **Internationalization (i18n)**: Multi-language support using i18n.
- **Email Handling**: Nodemailer for sending emails with custom templates using EJS.
- **File Uploads**: Multer for file uploads (e.g., for hotel and room images).
- **Security**: Helmet, CORS, and Rate Limiting for enhanced security.

## Technologies Used

- **Backend**: Node.js, Express.js , Nestjs
- **Database**: PostgreSQL
- **Authentication**: JWT, Google OAuth
- **Payment Gateway**: Stripe, Cash payments
- **File Upload**: Multer
- **Internationalization**: i18n
- **Email**: Nodemailer, EJS
- **Testing**: Swagger, Postman
- **Security**: Helmet, CORS, Rate Limiting

## Installation

### Prerequisites

- Node.js
- PostgreSQL
- Stripe API keys (for Stripe payment functionality)

### Steps to Run Locally

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/hotel-management-system.git
    ```

2. Navigate to the project folder:
    ```bash
    cd hotel-management-system
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add your environment variables (see `.env.example`).

5. Run the application:
    ```bash
    npm start
    ```

6. Access the app at `http://localhost:5000`.

## API Documentation

This project includes a RESTful API for interacting with the hotel management system.

### Available Endpoints

- **Authentication**: `/api/v1/users/auth/login`, `/api/v1/users/auth/register`, `/auth/google/sign`, `/api/v1/users/forgot-password`
- **Hotels**: `/api/v1/hotels`, `/api/v1/hotels/:id`
- **Rooms**: `/api/v1/rooms`, `/api/v1/rooms/:id`
- **Bookings**: `/api/v1/bookings`, `/api/v1/bookings/:id`
- **Payments**: `/api/v1/payment/stripe`, `/api/v1/payment/cash`
- **Reviews**: `/api/v1/reviews`, `/api/v1/reviews/:id`

You can view the full API documentation using **Swagger** [here](http://localhost:5000/swagger).
You can view the full API documentation using **Postman** [here](https://documenter.getpostman.com/view/34351164/2sB2cYbKwM).

## How to Contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## ENV File
```
# 🛢️ Database
DB_DATABASE=your_database_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_PORT=5432

NODE_ENV=development
PORT=5000

# 🔐 JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# 📬 SMTP (Email Service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_email_app_password

# 🌍 Domains
DOMAIN=http://localhost:5000
CLIENT_DOMAIN=http://localhost:3000

# 🔐 Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# 💳 Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key

```      

## License

MIT License. See LICENSE file for more details.
