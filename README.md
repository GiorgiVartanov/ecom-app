<h1 align="center">PC Part Store - <span style="opacity: 0.6;">Portfolio Project</span></h1>

<p align="center">
  <strong>A full-stack ecommerce platform for PC parts and components</strong>
</p>

<p align="center">
  <a href="">
    <img src="https://img.shields.io/badge/Live%20Demo-View%20App-blue?style=for-the-badge&logo=netlify" alt="Live Demo [WIP]">
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
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Possible Improvements](#possible-improvements)
<!-- - [Known Bugs](#known-bugs) -->

## Features

### User Features

- **Product Browsing**: Browse and search PC parts by category, brand, price, and other attributes
- **Product Details**: Detailed product pages with images, descriptions, attributes, and user reviews
- **Review System**: Review and rate products
- **Shopping Cart**: Add/remove items, update amount
- **Checkout Process**: Checkout with order confirmation
- **User Management**: Registration, login, and order history
- **Wishlist**: Mark products as favorites

### Admin Features

- **Dashboard**: Admin dashboard with ability to start a discount[WIP] and review user's orders
- **Product Management**: Add, edit, and manage products
- **Order Management**: Update order statuses, and track fulfillment
- **User Management**: View and manage customer accounts
- **Sales Analytics**: Track sales performance and revenue

## Technologies

### Frontend

- **[React 19](https://react.dev/)** - The library for web user interfaces
- **[React Router v7](https://reactrouter.com/)** - Routing <span style="opacity: 0.6;">(using Declarative mode, not newer Data mode or FrameWork mode)</span>
- **[TanStack Query](https://tanstack.com/query/latest)** - Data-fetching library <span style="opacity: 0.6;">(DevTools available with Ctrl/Cmd + Shift + D or by using toggleDevtools() function in the browser console)</span>
- **[React Hook Form](https://react-hook-form.com/)**
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

## Project Structure

```
ecom-app/
├── client/                                         # React frontend
│   ├── src/
│   │   ├── api/                                    # API service functions
│   │   │   ├── axiosConfig.js
│   │   │   ├── auth.api.js
│   │   │   ├── cart.api.js
│   │   │   ├── orders.api.js
│   │   │   ├── products.api.js
│   │   │   ├── user.api.js
│   │   │   └── wishlist.api.js
│   │   │
│   │   ├── assets/                                 # Static assets (fonts, icons, images)
│   │   │   ├── fonts/                              # fonts
│   │   │   └── icons/                              # SVG icons
│   │   │
│   │   ├── components/                             # UI components
│   │   │   ├── cart/                               # Cart-related components
│   │   │   │   ├── CartItem.jsx
│   │   │   │   ├── CartItemList.jsx
│   │   │   │   ├── CartModal.jsx
│   │   │   │   └── WishlistModal.jsx
│   │   │   │
│   │   │   ├── common/                             # Reusable UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Carousel.jsx
│   │   │   │   ├── ConfirmPanel.jsx
│   │   │   │   ├── DropdownMenu.jsx
│   │   │   │   ├── Image.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── PageSelector.jsx
│   │   │   │   ├── Range.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   └── TextArea.jsx
│   │   │   │
│   │   │   ├── orders/                             # Order-related components
│   │   │   │   └── OrderCard.jsx
│   │   │   │
│   │   │   ├── products/                           # Product-related components
│   │   │   │   ├── PreviewImage.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductImageSelect.jsx
│   │   │   │   ├── SearchFilterModal.jsx
│   │   │   │   ├── TagField.jsx
│   │   │   │   ├── TagFields.jsx
│   │   │   │   ├── TagList.jsx
│   │   │   │   └── UploadProduct.jsx
│   │   │   │
│   │   │   ├── reviews/                            # Review-related components
│   │   │   │   ├── ReviewInput.jsx
│   │   │   │   ├── ReviewItem.jsx
│   │   │   │   ├── ReviewList.jsx
│   │   │   │   └── ReviewStarSelect.jsx
│   │   │   │
│   │   │   ├── structure/                          # Layout components (Header, Footer)
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Header.jsx
│   │   │   │
│   │   │   └── user/                               # User-related components
│   │   │       ├── AuthModal.jsx
│   │   │       └── SettingsModal.jsx
│   │   │
│   │   ├── hooks/                                  # Custom React hooks
│   │   │   ├── useDocumentTitle.jsx
│   │   │   └── useOnClickOutside.jsx
│   │   │
│   │   ├── layouts/                                # Page layouts
│   │   │   ├── Main.layout.jsx
│   │   │   └── ProtectedRoute.layout.jsx
│   │   │
│   │   ├── pages/                                  # Pages
│   │   │   ├── About.page.jsx
│   │   │   ├── Checkout.page.jsx
│   │   │   ├── Dashboard.page.jsx
│   │   │   ├── Home.page.jsx
│   │   │   ├── Orders.page.jsx
│   │   │   ├── PageNotFound.page.jsx
│   │   │   ├── ProductDetails.page.jsx
│   │   │   ├── Profile.page.jsx
│   │   │   ├── Search.page.jsx
│   │   │   │
│   │   │   └── dashboard/                          # Admin dashboard pages
│   │   │       ├── AddProduct.dashboard.page.jsx
│   │   │       ├── EditProduct.dashboard.page.jsx
│   │   │       ├── Orders.dashboard.page.jsx
│   │   │       ├── Sales.dashboard.page.jsx
│   │   │       └── Users.dashboard.page.jsx
│   │   │
│   │   ├── store/                                  # Zustand state management
│   │   │   ├── useAuthStore.js
│   │   │   ├── useConfirmModalStore.js
│   │   │   └── useModalStore.js
│   │   │
│   │   └── util/                                   # Utility functions
│   │       └── convertToBase64.js
│   │
│   └── public/                                     # Static assets
│       │
│       └── images/                                 # Product and component images
│
└── server/                                         # Node.js backend
    ├── src/
    │   ├── config/                                 # Configuration files
    │   │   ├── cloudinary.js
    │   │   └── db.js
    │   │
    │   ├── controllers/                            # Route controllers
    │   │   ├── auth.controller.js
    │   │   ├── cart.controller.js
    │   │   ├── order.controller.js
    │   │   ├── products.controller.js
    │   │   ├── sale.controller.js
    │   │   ├── user.controller.js
    │   │   └── wishlist.controller.js
    │   │
    │   ├── middleware/                             # Custom middleware
    │   │   └── authMiddleware.js
    │   │
    │   ├── routes/                                 # API routes
    │   │   ├── auth.routes.js
    │   │   ├── cart.routes.js
    │   │   ├── order.routes.js
    │   │   ├── products.routes.js
    │   │   ├── sale.routes.js
    │   │   ├── user.routes.js
    │   │   └── wishlist.routes.js
    │   │
    │   └── utils/                                  # Utility functions
    │       └── uploadImage.js
    │
    └── prisma/                                     # Database schema and migrations
        │
        ├── migrations/                             # Database migration files
        └── schema.prisma                           # Database schema
```

## Key Features

### Performance Optimizations

- React Query for efficient data fetching and caching
- Images are in Webp format and are downscaled to 1000x1000 when uploaded
- Data prefetching on link hover
- Lazy loading for better initial load times

## Possible Improvements

- **Payment Integration**: Stripe payment processing
- **Email Notifications**: Order confirmations and status updates
- **Inventory Management**: Real-time stock tracking
- **Multi-language Support**: Internationalization (i18n)
- **PWA**: Offline support and app-like experience
- **Advanced Analytics**: Detailed sales and user behavior insights
- **Log in With**: Google, Facebook authentication

<!-- ## Known bugs -->

---

**This project was built as a portfolio application to showcase my skills**
