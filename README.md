# UMKM Core - Frontend

**Status:** MVP Ready for Demo  
**Version:** 0.1.0

## 📖 Overview

**UMKM Core** is a specialized Point of Sale (POS) and inventory management application designed for Indonesian Small and Medium Enterprises (UMKM). It simplifies business operations by integrating cashier functions, real-time stock tracking, and financial reporting into a single, intuitive interface.

Unlike complex ERP systems, UMKM Core is built for simplicity, targeting coffee shops, warungs, and small retail stores who need to transition from manual bookkeeping (or Excel) to a modern digital solution.

## 🚀 Key Features

*   **Point of Sale (POS):** Fast, touch-friendly cashier interface optimized for tablets.
*   **Inventory Management:** Real-time stock tracking, low stock alerts, and material usage tracking.
*   **Product Management:** Easy product setup with support for **Bill of Materials (BOM)** to calculate costs accurately (e.g., finding the cost of a cup of coffee based on its ingredients).
*   **Reports:** Automated daily sales, stock movement, and profit reports.
*   **Role-Based Access:** Secure distinct views and permissions for Owners (Admin), Managers, and Staff.

## 🛠 Tech Stack

*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **UI Library:** [Material UI (MUI) v7](https://mui.com/)
*   **State Management:**
    *   Server State: [TanStack Query v5](https://tanstack.com/query/latest)
    *   Auth/UI State: React Context + Hooks
*   **Deployment:** Vercel (SPA mode)

## 💻 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/umkmcore-fe.git
    cd umkmcore-fe
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment:
    Create a `.env` file in the root directory (see `.env.example`).
    ```bash
    VITE_API_BASE_URL=http://72.60.79.179/api/v1
    ```

4.  Start the Development Server:
    ```bash
    npm run dev
    ```

5.  Build for Production:
    ```bash
    npm run build
    ```

## 📚 Documentation

Detailed documentation can be found in the `docs/` directory:

*   [**Frontend Specs & Instructions**](./docs/frontend_instruction.md): detailed feature breakdown.
*   [**Marketing Positioning**](./docs/MARKETING_POSITIONING.md): Target market and product strategy.
*   [**Milestones**](./docs/MILESTONES.md): Development roadmap and current progress.
*   [**Fixes Log**](./docs/FIXES.md): Record of recent bug fixes and improvements.
*   [**Deployment Guide**](./docs/VERCEL_DEPLOYMENT.md): Instructions for deploying to Vercel.

## 🤝 Contributing

This project is currently in the **Pre-Beta** phase. Please refer to `docs/MILESTONES.md` for the current roadmap.
