# UMKM Core - Frontend Project Guide

**Version**: 0.1.0
**Date**: November 23, 2025
**Author**: Wildan Ghifari & Gemini

---

## 1. Project Overview

This document provides specific guidance for the `umkmcore-frontend` application, which is part of the larger UMKM Core ERP system.

*   **Overall Project**: UMKM Core is a modern, multi-tenant mini ERP system designed for Indonesian small and medium enterprises (UMKM). It consists of a backend API and this frontend user interface.

---

## 2. Project Structure

The frontend application (`umkmcore-frontend`) is located within the `/apps/` directory, alongside the backend application (`umkmcore`).

```
/apps/
├── umkmcore/           # The backend application
└── umkmcore-frontend/  # This frontend application
```

---

## 3. Frontend (`umkmcore-frontend`)

This directory contains the React-based frontend application.

*   **Technology Stack**: React, Vite, Material-UI (MUI), React Query, Jest, React Testing Library.
*   **Purpose**: To provide a rich, data-dense user interface for the UMKM Core ERP system. It communicates with the backend via its REST API.

### Key Commands (Frontend)

All commands should be run from the `umkmcore-frontend` directory.

```bash
# Start the development server
npm run dev

# Build the application for production
npm run build

# Lint the codebase
npm run lint

# Preview the production build
npm run preview
```

### Development Conventions (Frontend)

*   **Build Tool**: Vite is used for fast development and bundling. Configuration is in `vite.config.js`.
*   **UI Components**: Material-UI (MUI) is the primary component library.
*   **State Management**: Asynchronous state and data fetching are handled by React Query (`@tanstack/react-query`).
*   **Linting**: ESLint is configured with rules for React and JSX. The configuration can be found in `eslint.config.js`.
*   **Testing**: Jest and React Testing Library are set up for unit and component testing.

---

## 4. Getting Started

To run the frontend application for development:

1.  **Ensure Backend is Running**: The frontend communicates with the backend. Make sure the `umkmcore` backend is running (typically at `http://localhost:3000`). Refer to the main `../GEMINI.md` or `../umkmcore/GEMINI.md` for backend setup instructions.
2.  **Start the Frontend**:
    *   Navigate to the frontend directory: `cd umkmcore-frontend` (you should already be here).
    *   Start the frontend development server: `npm run dev`
    *   The frontend will be available at `http://localhost:5173` by default.

You can now access the web application in your browser and it will communicate with the local backend server.
