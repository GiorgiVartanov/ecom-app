<h1 align="center">PC Part Store</h1>

<p align="center">
  <strong>Portfolio project</strong>
</p>

<p align="center">
  <strong>A full-stack ecommerce platform for PC parts and components</strong>
</p>

<p align="center">
  <a href="https://www.pcpal-portfolio.store/">
    <img src="https://res.cloudinary.com/dfac5lkeh/image/upload/image_zypvyr.webp" alt="pcpal portfolio" width="300" style="border: 1px solid black;" />
  </a>
</p>

## Table of Contents

- [TLDR](#tldr)
- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Possible Improvements](#possible-improvements)
- [Credits](#credits)

## TLDR

A full-stack ecommerce platform for PC parts, featuring product browsing, detailed product pages, product reviews, shopping cart, checkout, wishlist, and user management. Admins can manage products and orders. Built with React 19, React Router v7, TanStack Query, Zustand, Tailwind CSS, React Hook Form, Axios, and Zod on the frontend; Bun, Express, Prisma, PostgreSQL, JWT, and Cloudinary (for image hosting) on the backend. Includes rate limiting (400 requests per day per IP, 150 requests per 15 minutes per IP, and 25 requests per 15 minutes for authentication), image optimization (all images are in WebP format, during upload format is changed to WebP and they are resized to 1000x1000px), and performance enhancements (lazy loading, prefetching). Deployed on AWS (Amplify for frontend (domain is pcpal-portfolio.store), EC2 ubuntu for backend and database (both are on a same instance, database is on localhost:5432 (it could be possible to access it with database management tools that have SSH Tunnel) and backend is hosted with PM2 and Nginx on a domain api.pcpal-portfolio.store)). Domain was purchased on vercel. Some features like advanced analytics, and profile management are not yet implemented.

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

- **Dashboard**: Admin dashboard with ability to start a discount[WIP] and change user's orders status
- **Product Management**: Add, edit, and manage products
- **Order Management**: Update order statuses, and track fulfillment
- **User Management**: View and manage customer accounts
- **Sales Analytics**: Track sales performance and revenue

## Other features

- **Dynamic page title**: Page title changes with a useDocumentTitle hook
- **Rate limiting**: Rate limiting with express-rate-limit (150 requests per 20 minutes per IP, 15 auth attempts per 20 minutes per IP)

## Technologies

### Frontend

- **[React 19](https://react.dev/)** - The library for web user interfaces
- **[React Router v7](https://reactrouter.com/)** - Routing _(using Declarative mode, not newer Data mode or FrameWork mode)_
- **[TanStack Query](https://tanstack.com/query/latest)** - Data-fetching library
- **[React Hook Form](https://react-hook-form.com/)** - Form library
- **[Zod](https://zod.dev/)** - Schema validation
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Axios](https://axios-http.com/)** - Promise based HTTP client for the browser and node.js
- **[Tailwind CSS](https://tailwindcss.com/)** - A utility-first CSS framework

### Backend

- **[Bun](https://bun.sh/)** – JavaScript runtime and package manager _(Node.js-compatible)_
- **[Express.js](https://expressjs.com/)** - Web application framework
- **[Prisma](https://www.prisma.io/)** - Database ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[JWT](https://jwt.io/)** - JSON Web Token authentication
- **[Zod](https://zod.dev/)** - Schema validation
- **[Cloudinary](https://cloudinary.com/)** - Cloud image storage

### Development Tools

- **[Vite](https://vitejs.dev/)** - Fast build tool and development server

## Setup

_if you want to fun this app locally_

### Prerequisites

- Node.js or Bun
- PostgreSQL database
- Cloudinary account (for image uploads) _(or you can contact me for my cloudinary API key)_

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
   JWT_SECRET="jwt-secret"
   CLOUDINARY_CLOUD_NAME="cloud-name"
   CLOUDINARY_API_KEY="api-key"
   CLOUDINARY_API_SECRET="api-secret"
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
   # Start application (in a root directory)
   bun run dev

   # or

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
- Backend was deployed on AWS EC2 together _(on a same instance)_ with PostgreSQL

## API Endpoints

- _(guest)_ means that this endpoint is only accessible by guest, user and admin
- _(user)_ means that this endpoint is only accessible by user and admin
- _(admin)_ means that this endpoint is only accessible by admin

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Products

- `GET /api/products/tags` - Get all search tags that have Searchable value set to true _(guest)_
- `GET /api/products/:id` - Get single product by ID _(guest)_
- `GET /api/products` - Get list of products _(guest)_
- `POST /api/products/:id/reviews` - Post a review _(user)_
- `DELETE /api/products/:id/reviews/:reviewId` - _(user)_
- `POST /api/products` - Create product _(admin)_
- `POST /api/products/:id` - Update product _(admin)_
- `DELETE /api/products/:id` - Mark product as delisted, its possible _(not yet)_ to restore it latter _(admin)_

### Cart

- `POST /api/cart` - Add item to cart _(user)_
- `GET /api/cart` - Get cart _(user)_
- `PATCH /api/cart/:id` - Edit cart item _(user)_
- `DELETE /api/cart/:id` - Remove cart item _(user)_

### Order

- `POST /api/orders` - Create order _(user)_
- `GET /api/orders/all` - Get user orders _(admin)_
- `GET /api/orders/:orderId` - Get single order by ID _(user)_
- `GET /api/orders` - Get list of orders _(user)_
- `GET /api/orders/:orderId/admin` - Get user's order list _(admin)_
- `PATCH /api/orders/:orderId` - Edit order status _(admin)_

### Sale

- `PUT /api/sale/start` - Starts sale (discount) _(admin)_
- `PUT /api/sale/end` - Ends sale _(admin)_

### Wishlist

- `POST /api/wishlist/:id` - Add item to wishlist _(user)_
- `DELETE /api/wishlist/:id` - Remove item from wishlist _(user)_
- `GET /api/wishlist/end` - Get wishlist _(user)_

## Key Features

### Performance Optimizations

- React Query for efficient data fetching and caching
- Images are in Webp format and are downscaled to 1000x1000 when uploaded
- Data prefetching on link hover
- Lazy loading for better initial load times

## Possible Improvements

- Payment integration using Stripe payment processing _(Stripe has a dev mode, without real transactions)_
- Email notifications on order status updates _(I can use something like MailChimp with email that has same domain as this website)_
- Inventory Management Real-time stock tracking _(Right now if a user orders something, and if admin changes this order's status, product's quantity isn't updated)_
- Multi-language support Internationalization (i18n) using react-18next library _(Not that hard to implement, I had done it in a different project, it would just be a bit monotonous)_
- PWA with offline support and app-like experience _(Could be done with vite-plugin-pwa vite plugin, I just think that this app will need some design changed to feel more like an app)_
- Sign In With functionality like Google or Facebook or GitHub authentication
- Improve error handling on a client side
- Implement tests using Jest, RTL or Cypress
- JWT Token expiration with refresh token, right now its infinite
- Move Zod schemas into a shared folder, or even better create an internal npm package, Right now there are 2 zod-schema folders, one on client another on server
- Place backend routes more logically. for example functions are inside product controller
- Implement functionally for discounts
- Add profile pages
- Add user management page
- Add ability to restore delisted products

---

## Other info

**This project was built as a portfolio application to showcase my skills**

## Credits

- _Hero image - <a href="https://www.freepik.com/free-photo/gaming-setup-arrangement-high-angle_31590136.htm#from_element=cross_selling__photo" target="_blank" rel="noopener noreferrer">freepik</a></span>_
- _Icons - <a href="https://fontawesome.com/">font awesome</a>_
- _Company images - Taken from an official media kits from official webpages_
- _Product images - (they are just text on a gray background, created by me in gimp)_

## Notes

_I used simple images (grate background, white text) as a placeholders because I couldn't find consistent product images, at first I was going to take them from amazon or microcenter, but then I thought that it would probably be copyright infringement_
_Company logo's are from an official media assets, and comply with usage terms (its not implied that this app is affiliated with them, and the only editing done to images is resizing)_
_Some pages and functionality are not yet implemented in this project, especially the Product Discounts and User/Profile Management_
