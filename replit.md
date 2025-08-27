# Sokobo sa Matepe E-commerce Platform

## Overview

Sokobo sa Matepe is a full-stack e-commerce platform specializing in streetwear, graphic design, and custom branded merchandise. The application features a modern React frontend with a comprehensive Express.js backend, built for selling custom apparel and showcasing design portfolio work.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Custom component library built on Radix UI primitives with Tailwind CSS
- **State Management**: 
  - TanStack Query for server state management and caching
  - React Context for authentication and shopping cart state
  - React Hook Form with Zod validation for form handling
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with CSS variables for theming, supporting dark mode

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Authentication**: Session-based authentication using Passport.js with local strategy
- **Database ORM**: Drizzle ORM with PostgreSQL as the database
- **Session Storage**: PostgreSQL session store with connect-pg-simple
- **API Design**: RESTful API endpoints with proper error handling and validation

### Database Schema
The application uses PostgreSQL with four main tables:
- **Users**: Stores user information including name, email, password hash, role (customer/admin), and timestamps
- **Products**: Contains product details including name, category, description, price, stock, sizes array, images array, and featured status
- **Orders**: Tracks order information with user relationships, items array, total amount, status, and shipping address
- **Portfolio**: Manages portfolio items with title, category, description, and image URLs

### Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL storage
- **Password Security**: Scrypt-based password hashing with salt
- **Role-based Access**: Customer and admin roles with protected routes
- **JWT Integration**: JWT tokens for API authentication alongside sessions

### API Structure
- **Product Routes**: CRUD operations for products with category filtering and featured product support
- **Authentication Routes**: Login, logout, registration, and user profile management
- **Order Management**: Order creation, status updates, and user order history
- **Portfolio Routes**: Portfolio item management for showcasing design work
- **Admin Routes**: Protected administrative functions for content management

## External Dependencies

### Database & Infrastructure
- **PostgreSQL**: Primary database using Neon Database serverless PostgreSQL
- **Drizzle ORM**: Type-safe database operations with automatic migrations

### UI & Styling
- **Radix UI**: Comprehensive component primitives for accessible UI components
- **Tailwind CSS**: Utility-first CSS framework with custom theming
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool with hot module replacement and development server
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds

### Third-party Services
- **Image Hosting**: Unsplash URLs for product and portfolio images (placeholder implementation)
- **Replit Integration**: Development environment integration with runtime error handling