# Project Milestones & Roadmap

**Current Stage:** Phase 1 (MVP Complete / Pre-Beta)  
**Last Updated:** December 6, 2025

This document tracks the development progress of UMKM Core, from initial MVP to public launch.

---

## 🚩 Phase 1: MVP Development (Current)
**Goal:** Build a functional product ready for internal testing and demo.

### ✅ Completed
- [x] **Project Setup**: Vite + React + MUI architecture.
- [x] **Authentication**: Login/Register with JWT handling.
- [x] **Core Inventory**:
    - Material CRUD (Review, Create, Update, Delete).
    - Product CRUD with Bill of Materials (BOM) support.
    - Low-stock indicators.
- [x] **Point of Sale (POS)**:
    - Product selection grid.
    - Cart management.
    - Checkout flow and order creation.
- [x] **Role-Based Access Control (RBAC)**:
    - Admin (Owner) vs Staff roles.
    - Protected routes.
- [x] **Basic Reporting**:
    - Stock levels.
    - Sales reports.
- [x] **Deployment**:
    - CI/CD pipeline to Vercel.
    - CORS and SPA routing configuration fixed.

### 🚧 In Progress / Refining
- [ ] **UI Polish**: Enhancing the dashboard visual hierarchy and "wow" factor.
- [ ] **User Feedback Loop**: Setting up mechanisms to capture beta tester feedback.
- [ ] **Mobile Responsiveness Check**: Ensuring 100% usability on mobile devices (for Owners viewing reports).

---

## 🚀 Phase 2: Beta Launch (Target: Weeks 1-4 Post-MVP)
**Goal:** Validate the product with 10-20 real users (Friends & Family).

- [ ] **Beta Onboarding**:
    - Create "Welcome" guide or tooltip walkthroughs.
    - Manual data import service for beta users.
- [ ] **Reliability Hardening**:
    - Fix any edge-case bugs found by beta users.
    - Improve error handling (friendly error messages).
- [ ] **Feature Gaps**:
    - Implement offline support for POS (critical for unstable connections).
    - Add "Cash Management" (Shift open/close) flows if requested.

---

## 📈 Phase 3: Soft Launch (Target: Weeks 5-12)
**Goal:** Acquire 50 paying customers in a specific niche (e.g., Coffee Shops).

- [ ] **Marketing Integration**:
    - Landing page launch with value propositions.
    - WhatsApp Business API integration for support.
- [ ] **Advanced Features**:
    - Multi-outlet management support.
    - Advanced Profit/Loss reports.
    - Stock adjustment history logs.
- [ ] **Performance Optimization**:
    - Code splitting and lazy loading for faster initial load.

---

## 🌎 Phase 4: Public Launch & Scale (Target: Week 13+)
**Goal:** Scale to 100+ customers and broader market push.

- [ ] **Self-Service Onboarding**: Fully automated signup and store setup wizard.
- [ ] **Payment Integration**: Digital wallet (QRIS/E-Wallet) integration alongside cash.
- [ ] **Mobile App Wrapper**: Native wrapper (TWA or Capacitor) for Play Store listing.
