# Frontend Development Instruction for UMKM Core

## 1. Project Goal

The primary objective is to create a modern, intuitive, and highly functional frontend for the UMKM Core ERP system. This web application will serve as the primary user interface for all backend services, enabling Indonesian small and medium enterprises (UMKM) to manage their business operations with ease and efficiency.

The frontend must be a **Progressive Web App (PWA)**, installable on any device and fully responsive, offering a seamless experience on desktops, tablets, and mobile phones.

A core, integrated feature of this application will be a dedicated **Point of Sale (POS)** interface.

## 2. Core UI/UX Principles

- **Modern & Clean Aesthetics:** Employ a minimalist design. Use whitespace effectively and maintain a consistent visual language.
- **Data-Dense Dashboards:** Information should be presented in a clear, digestible format. Utilize charts, graphs, and summary cards to provide at-a-glance insights.
- **Intuitive Workflows:** User journeys should be logical and require minimal clicks. Complex tasks should be broken down into simple, guided steps.
- **Performance:** The application must be fast and responsive. Use techniques like code splitting, lazy loading, and optimistic UI updates (via React Query) to ensure immediate feedback.
- **Accessibility:** Adhere to WCAG guidelines to ensure the application is usable by everyone.
- **Consistency:** Strictly use the **Material-UI (MUI)** component library to build all UI elements. Do not introduce other UI libraries.

## 3. Technology Stack

- **Framework:** React (using Vite)
- **UI Library:** Material-UI (MUI)
- **State Management:**
    - **Asynchronous/Server State:** TanStack React Query is mandatory for all API interactions (fetching, caching, mutations).
    - **Local/UI State:** Use React Hooks (`useState`, `useContext`, `useReducer`).
- **Language:** JavaScript (ES6+)
- **Styling:** JSS (built into MUI) or Styled Components.

## 4. Feature Modules & Implementation Guide

### 4.1. Authentication
- **Login Page:** A clean, simple form for `storeId`, `username`, and `password`. Include a link to the registration page.
- **Registration Page:** A multi-step form to register a new store and an admin user.
- Upon successful login, the JWT token must be securely stored, and all subsequent API requests must include it in the `Authorization` header.
- The logged-in user's data and role (fetched from `/api/v1/auth/me`) must be stored in a global context for easy access throughout the application.

### 4.2. Main Dashboard
This is the landing page after login. The dashboard must be role-based.
- **Admin/Manager View:**
    - Key metrics (cards): Total Sales (Today), Low Stock Items, Top Selling Products.
    - Charts: Sales trends (last 7 days), Material usage overview.
    - Quick access buttons to common actions (e.g., "New Sale", "Add Material").
- **Staff View:**
    - A simplified view, perhaps focused on recent sales or a direct link to the POS interface.

### 4.3. Inventory Management
- **Materials Page:**
    - A comprehensive table displaying all materials with columns for SKU, Name, Current Stock, Minimum Stock, and Status (OK, Low, Out of Stock).
    - Implement server-side search, filtering (by category, stock status), and pagination.
    - A "Create Material" form (modal or separate page).
    - Each row should have "Edit" and "Delete" actions (respecting user roles).
    - **Material Detail View:** Clicking a material should navigate to a detail page showing its complete transaction history, stock levels over time (chart), and a list of all products that use this material.
- **Stock Transactions:**
    - Dedicated forms for `IN` (e.g., receiving from a supplier), `OUT` (e.g., spoilage), and `ADJUSTMENT` (e.g., stock count correction). These forms must be simple and efficient.

### 4.4. Products & Recipes (BOM)
- **Products Page:**
    - A grid or table view of all products, showing their image, name, SKU, selling price, and calculated cost price.
    - Server-side search, filtering, and pagination.
    - CRUD functionality for products, respecting user roles.
- **Product Detail/Edit View:**
    - This interface must allow for editing product details.
    - **Crucially, it must include a "Bill of Materials" (BOM) section.** This section should allow the user to search for and add materials from inventory, specify the quantity needed for the recipe, and update/remove existing materials.
    - The UI should feature a "Recalculate Cost" button that triggers the API to update the product's cost price based on the current BOM.

### 4.5. User Management (Admin Only)
- A secure section for managing users within the store.
- Display users in a table with their name, email, and role.
- Functionality to:
    - Invite/Create new users (Staff, Manager).
    - Change a user's role.
    - Deactivate/Reactivate users.
    - Reset a user's password.

### 4.6. Reports
- Create a dedicated page for each report available from the backend API (`/api/v1/reports/*`).
- Use data visualization libraries (e.g., Recharts, Chart.js) to present the data in an understandable format (bar charts, line graphs, pie charts).
- All reports must be filterable (e.g., by date range, category).

## 5. Dedicated Point of Sale (POS) Feature

This is the most critical interactive feature. It must be optimized for speed and usability, ideally on a tablet.

- **UI Layout:**
    - **Left/Center (Main Area):** A searchable, touch-friendly grid of products, organized by categories. Each product card should show its name, image, and price.
    - **Right Side (Cart Area):** A running list of items added to the current order. Each item should be editable (quantity) or removable. It should display the subtotal, tax (if applicable), and total.
- **Workflow:**
    1. The cashier selects products from the grid or searches for them via a prominent search bar.
    2. Items are added to the cart on the right.
    3. The cashier can select a customer from a searchable list (optional).
    4. On clicking "Checkout", a payment modal appears.
    5. The cashier selects the payment method and enters the amount received.
    6. On "Complete Sale", the frontend must call the appropriate API endpoint to create the sales order. **The backend is responsible for all inventory deductions.**
- **Key Features:**
    - **Barcode Scanner Support:** The main search input should be able to receive input from a USB barcode scanner.
    - **Keyboard Shortcuts:** Implement shortcuts for common actions (e.g., focusing search, checking out).
    - **Offline Capability (Future Goal):** While not required for the first version, the architecture should eventually support queuing sales offline and syncing them when a connection is restored.

## 6. Role-Based Access Control (RBAC)

The UI must dynamically adapt based on the user's role.
- **Admin:** Full access to everything.
- **Manager:** Access to all features except User Management.
- **Staff:** Primarily limited to the POS and viewing their own sales history. Cannot edit products or materials.

Use the global user context to conditionally render navigation links, buttons, and entire pages. For example, the "User Management" link in the sidebar should not be visible to Managers or Staff.

## 7. API Endpoint Reference

This section provides a complete list of all backend API endpoints that the frontend application will interact with.

### Authentication
- `POST /api/v1/auth/register`: Register a new store and admin user.
- `POST /api/v1/auth/login`: Log in a user and receive a JWT token.
- `GET /api/v1/auth/me`: Fetch the profile of the currently authenticated user.

### User Management (Admin Only)
- `GET /api/v1/users`: List all users with filtering, search, and pagination.
- `POST /api/v1/users`: Create a new user.
- `GET /api/v1/users/stats`: Get statistics about users.
- `GET /api/v1/users/:id`: Get details for a single user.
- `PUT /api/v1/users/:id`: Update a user's details.
- `DELETE /api/v1/users/:id`: Deactivate a user (soft delete).
- `PATCH /api/v1/users/:id/role`: Change a user's role.
- `PATCH /api/v1/users/:id/password`: Reset a user's password.
- `PATCH /api/v1/users/:id/activate`: Reactivate a deactivated user.

### Materials & Inventory
- `GET /api/v1/materials`: List all materials with search, filters, and pagination.
- `POST /api/v1/materials`: Create a new material.
- `GET /api/v1/materials/:id`: Get details for a single material.
- `PUT /api/v1/materials/:id`: Update a material.
- `DELETE /api/v1/materials/:id`: Delete a material.
- `GET /api/v1/materials/:id/transactions`: Get the transaction history for a material.
- `GET /api/v1/materials/:id/usage`: Find which products use a specific material.

### Stock Transactions & Adjustments
- `POST /api/v1/stock-transactions`: Create a new stock transaction (IN, OUT, ADJUSTMENT).
- `GET /api/v1/stock-transactions`: List all stock transactions with filtering.
- `GET /api/v1/stock-transactions/:id`: Get a single transaction.
- `POST /api/v1/inventory/stock-count`: Perform a stock count adjustment.
- `POST /api/v1/inventory/damage`: Record damaged or lost inventory.

### Products & Bill of Materials (BOM)
- `GET /api/v1/products`: List all products with search, filters, and pagination.
- `POST /api/v1/products`: Create a new product.
- `GET /api/v1/products/:id`: Get a single product (with an option to include its BOM).
- `PUT /api/v1/products/:id`: Update a product.
- `DELETE /api/v1/products/:id`: Delete a product.
- `GET /api/v1/products/:id/cost`: Calculate a product's cost based on its BOM.
- `POST /api/v1/products/:id/update-cost`: Recalculate and save a product's cost.
- `GET /api/v1/products/:productId/materials`: Get the BOM for a specific product.
- `POST /api/v1/products/:productId/materials`: Add a new material to a product's BOM.
- `PUT /api/v1/products/:productId/materials`: Bulk update a product's entire BOM.
- `PUT /api/v1/bom/:bomId`: Update a single entry in a BOM.
- `DELETE /api/v1/bom/:bomId`: Remove a material from a BOM.

### Point of Sale (POS) & Sales
- `GET /api/v1/customers`: List, search, and filter customers.
- `POST /api/v1/customers`: Create a new customer.
- `GET /api/v1/customers/:id`: Get details for a single customer.
- `PUT /api/v1/customers/:id`: Update a customer.
- `POST /api/v1/sales-orders`: Create a new sales order (the core POS transaction).
- `GET /api/v1/sales-orders`: List all sales orders with filtering.
- `GET /api/v1/sales-orders/:id`: Get details of a single sales order.

### Reporting & Analytics
- `GET /api/v1/reports/stock`: Get a comprehensive stock report.
- `GET /api/v1/reports/low-stock`: Get a list of materials that are low in stock.
- `GET /api/v1/reports/stock-movement`: Analyze stock movement over a period.
- `GET /api/v1/reports/material-usage`: Analyze material consumption patterns.
- `GET /api/v1/reports/product-profit`: Analyze profit margins for products.
- `GET /api/v1/reports/forecast`: Get sales and inventory forecasts.

