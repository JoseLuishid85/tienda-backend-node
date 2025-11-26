# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js/Express backend for an e-commerce store ("tienda") built with Sequelize ORM and MySQL. The application manages products, categories, customers, sales (ventas), inventory, and user authentication with JWT.

## Development Commands

**Start the development server:**
```bash
npm start
```
This runs the app with nodemon on port 4000 at `http://localhost:4000`.

**No tests configured** - `npm test` will fail with "Error: no test specified"

## Architecture

### MVC Structure

The codebase follows a clean MVC pattern:

- **Models** (`models/`): Sequelize models defining database schema and relationships
- **Controllers** (`controllers/`): Business logic for each entity
- **Routes** (`routes/`): Express route definitions with middleware
- **Middlewares** (`middlewares/`): Authentication middleware (validar-token.js for admin, validar-token-cliente.js for customers)
- **Helpers** (`helpers/`): JWT token generation utilities (jwt.js, cliente_jwt.js)
- **Config** (`config/`): Database configuration using Sequelize

### Database Connection

The app uses Sequelize with MySQL. Database credentials are in `.env`:
- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
- Connection is initialized in `config/database.js`
- Database sync happens in `app.js` with `sequelize.sync({ alter: false })`
- **Important**: Set `alter: true` to auto-update schema during development (currently false)

### Key Model Relationships

**Products & Categories:**
- `Producto` belongs to `Categoria` and `SubCategoria`
- Products have variants (`Variedad`) for size/color/measurements
- Products have image galleries (`Galeria`)

**Sales (Ventas):**
- `Venta` belongs to `Cliente`, `Direccion`, and `Banco`
- `DetalleVenta` links `Venta` to `Producto` and optionally `Variedad`
- Sales track: nventa (sale number), forma_pago, transaccion, subtotal, envio, total, estado
- Sales include year/month/day fields for analytics

**Inventory:**
- `Ingreso` (stock intake) with `DetalleIngreso` (intake details)
- Stock tracked at both `Producto` and `Variedad` levels

**Users & Authentication:**
- `Usuario` for admin users
- `Cliente` for customers (with separate JWT secret)
- Two JWT middlewares: `validar-token.js` (admin) and `validar-token-cliente.js` (customer)

### API Routes

All routes are prefixed with `/store/api/`:

- `/login` - Authentication (authRouter.js)
- `/usuario` - User management
- `/categoria`, `/sub_categoria` - Category management
- `/producto` - Product CRUD with image upload
- `/variedad` - Product variants
- `/proveedor` - Suppliers
- `/cliente` - Customers
- `/direccion` - Addresses
- `/ingreso`, `/detalle_ingreso` - Inventory intake
- `/publico` - Public-facing routes (no auth)
- `/customer` - Customer-specific routes
- `/venta`, `/detalleventa` - Sales management
- `/banco` - Bank accounts for payments

### File Uploads

Uses Multer for file handling:
- Product images: `./uploads/productos`
- Gallery images: `./uploads/galeria`
- Images served via dedicated endpoints (e.g., `/obtener_image_producto/:img`)

### Authentication Flow

1. Admin users authenticate via `/store/api/login` and receive JWT with `JWT_SECRET`
2. Customer users use separate authentication with `JWT_SECRET_CLIENTE`
3. Protected routes use `validarJWT` middleware (checks `Authorization: Bearer <token>`)
4. Middleware attaches `req.usuario` or `req.cliente` to requests

### Slugs

Product titles are automatically converted to URL-friendly slugs using the `slugify` package (lowercase).

## Important Notes

- **Path separators**: The code uses Windows-style backslash (`\\`) for file path splitting. This may need adjustment for cross-platform compatibility.
- **Current branch**: `develop` (no main branch configured for PRs)
- **Sequelize logging**: Disabled in database config (`logging: false`)
- **CORS**: Enabled for all origins
- **Modified file**: `models/Venta.js` has uncommitted changes
