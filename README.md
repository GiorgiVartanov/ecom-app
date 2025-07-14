<h1 align="center">PC Part Store - <span style="opacity: 0.6;">Portfolio Project</span></h1>

<p align="center">
  <strong>A full-stack ecommerce platform for PC parts and components</strong>
</p>

<p align="center">
  <a href="https://www.pcpal-portfolio.store/">
    https://www.pcpal-portfolio.store/
  </a>
</p>

## Screenshots

[WIP]

<!-- ## Video Demonstration -->

<!-- [WIP] -->

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Possible Improvements](#possible-improvements)
- [Known Bugs](#known-bugs)

## Features

### User Features

- **Product Browsing**: Browse and search PC parts by category, brand, price, and other attributes
- **Product Details**: Detailed product pages with images, descriptions, attributes, and user reviews
- **Review System**: Review and rate products <span style="opacity: 0.6;">(reviews can only be written if it is in a user's order list, and has its status set to DELIVERED, status can be set by admin from dashboard)</span>
- **Shopping Cart**: Add/remove items, update product quantity
- **Checkout Process**: Checkout with order confirmation
- **User Management**: Registration, login, and order history
- **Wishlist**: Mark products as favorites

### Admin Features

- **Dashboard**: Admin dashboard with ability to start a discount[WIP] and review <span style="opacity: 0.6;">(see/change status)</span> user's orders
- **Product Management**: Add, edit, and manage products
- **Order Management**: Update order statuses, and track fulfillment
- **User Management**: View and manage customer accounts
- **Sales Analytics**: Track sales performance and revenue

## Other features

- **Dynamic page title** Page title changes with a useDocumentTitle hook
- **Rate limiting** Rate limiting with express-rate-limit (150 requests per 20 minutes per IP, 15 auth attempts per 20 minutes per IP)

## Technologies

### Frontend

- **[React 19](https://react.dev/)** - The library for web user interfaces
- **[React Router v7](https://reactrouter.com/)** - Routing <span style="opacity: 0.6;">(using Declarative mode, not newer Data mode or FrameWork mode)</span>
- **[TanStack Query](https://tanstack.com/query/latest)** - Data-fetching library
- **[React Hook Form](https://react-hook-form.com/)** - Form library
- **[Zod](https://zod.dev/)** - Schema validation
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Axios](https://axios-http.com/)** - Promise based HTTP client for the browser and node.js
- **[Tailwind CSS](https://tailwindcss.com/)** - A utility-first CSS framework

### Backend

- **[Bun](https://bun.sh/)** – JavaScript runtime and package manager <span style="opacity: 0.6;">(Node.js-compatible)</span>
- **[Express.js](https://expressjs.com/)** - Web application framework
- **[Prisma](https://www.prisma.io/)** - Database ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[JWT](https://jwt.io/)** - JSON Web Token authentication
- **[Zod](https://zod.dev/)** - Schema validation
- **[Cloudinary](https://cloudinary.com/)** - Cloud image storage

### Development Tools

- **[Vite](https://vitejs.dev/)** - Fast build tool and development server

## Setup

### Prerequisites

- Node.js or Bun
- PostgreSQL database
- Cloudinary account (for image uploads) <span style="opacity: 0.05;">(or you can contact me for my cloudinary API key)</span>

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/GiorgiVartanov/ecom-app
   cd ecom-app
   ```

2. **Install dependencies**

   ```bash
   # Install server dependencies
   cd server
   bun install

   # Install client dependencies
   cd ../client
   bun install
   ```

3. **Environment Setup**

   Create `.env` files in both `server/` and `client/` directories:

   **Server (.env)**

   <span style="opacity: 0.6;">(If you do not have a Cloudinary account, contact me and I can provide temporary credentials for testing)</span>

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecom-app"
   JWT_SECRET="your-jwt-secret"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   PORT=8000
   ```

   **Client (.env)**

   ```env
   VITE_BACKEND_URL="http://localhost:8000/api"
   ```

4. **Database Setup**

   ```bash
   cd server
   bun x prisma migrate dev
   bun x prisma generate
   ```

5. **Run the application**

   ```bash
   # Start the server (in server directory)
   bun run dev

   # Start the client (in client directory)
   bun run dev
   ```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Deployment

- Frontend was deployed on AWS Amplify
- Backend was deployed on AWS EC2 together <span style="opacity: 0.6;">(on a same instance)</span> with PostgreSQL

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Products

- `GET /api/products/tags` - Get all search tags that have Searchable value set to true <span style="opacity: 0.6;">(guest)</span>
- `GET /api/products/:id` - Get single product by ID <span style="opacity: 0.6;">(guest)</span>
- `GET /api/products` - Get list of products <span style="opacity: 0.6;">(guest)</span>
- `POST /api/products/:id/reviews` - Post a review <span style="opacity: 0.6;">(user)</span>
- `DELETE /api/products/:id/reviews/:reviewId` - Delete a review <span style="opacity: 0.6;">(user)</span>
- `POST /api/products` - Create product <span style="opacity: 0.6;">(admin)</span>
- `POST /api/products/:id` - Update product <span style="opacity: 0.6;">(admin)</span>
- `DELETE /api/products/:id` - Mark product as delisted, its possible to restore it latter <span style="opacity: 0.6;">(admin)</span>

### Cart & Orders

- `POST /api/cart` - Add item to cart <span style="opacity: 0.6;">(user)</span>
- `GET /api/cart` - Get cart <span style="opacity: 0.6;">(user)</span>
- `PATCH /api/cart/:id` - Edit cart item <span style="opacity: 0.6;">(user)</span>
- `DELETE /api/cart/:id` - Remove cart item <span style="opacity: 0.6;">(user)</span>

## Order

- `POST /api/orders` - Create order <span style="opacity: 0.6;">(user)</span>
- `GET /api/orders/all` - Get user orders <span style="opacity: 0.6;">(admin)</span>
- `GET /api/orders/:orderId` - Get single order by ID <span style="opacity: 0.6;">(user)</span>
- `GET /api/orders` - Get list of orders <span style="opacity: 0.6;">(user)</span>
- `GET /api/orders/:orderId/admin` - Get user's order list <span style="opacity: 0.6;">(admin)</span>
- `PATCH /api/orders/:orderId` - Edit order status <span style="opacity: 0.6;">(admin)</span>

### Sale

- `PUT /api/sale/start` - Starts sale (discount) <span style="opacity: 0.6;">(admin)</span>
- `PUT /api/sale/end` - Ends sale <span style="opacity: 0.6;">(admin)</span>

### Wishlist

- `POST /api/wishlist/:id` - Add item to wishlist <span style="opacity: 0.6;">(user)</span>
- `DELETE /api/wishlist/:id` - Remove item from wishlist <span style="opacity: 0.6;">(user)</span>
- `GET /api/wishlist/end` - Get wishlist <span style="opacity: 0.6;">(user)</span>

## Key Features

### Performance Optimizations

- React Query for efficient data fetching and caching
- Images are in Webp format and are downscaled to 1000x1000 when uploaded
- Data prefetching on link hover
- Lazy loading for better initial load times

## Possible Improvements

- Payment integration using Stripe payment processing
- Email notifications on order status updates
- Inventory Management Real-time stock tracking
- Multi-language support Internationalization (i18n) using react-18next library
- PWA with offline support and app-like experience
- Advanced analytics with detailed sales and user behavior insights
- Add log in with functionality like Google or Facebook authentication
- Improve error handling on a client side
- Implement tests using Jest, RTL or Cypress
- JWT Token expiration with refresh token, right now its infinite
- Move Zod schemas into a shared folder, or even better create an internal npm package, Right now there are 2 zod-schema folders, one on client another on server
- Place backend routes more logically. for example functions are inside product controller
- Implement functionally for discounts
- Add profile pages
- Add user management page
- Add ability to restore delisted products

## Known bugs -->

- On dashboard page, when adding product tags, tag can be set as search tag only after this tag is saved

---

**This project was built as a portfolio application to showcase my skills**
