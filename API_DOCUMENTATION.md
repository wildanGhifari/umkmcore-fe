# UMKM Core API Documentation

**Version:** 1.0.0
**Base URL:** `http://localhost:3000/api/v1`
**Production URL:** `http://72.60.79.179/api/v1`

This document serves as a complete reference for frontend developers building the UMKM Core web application.

---

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Materials Management](#materials-management)
4. [Products Management](#products-management)
5. [Bill of Materials (BOM)](#bill-of-materials-bom)
6. [Stock Transactions](#stock-transactions)
7. [Inventory Management](#inventory-management)
8. [Reports](#reports)
9. [Error Handling](#error-handling)
10. [Demo Credentials](#demo-credentials)

---

## Authentication

All endpoints except registration and login require JWT authentication via the `Authorization` header.

### Register Company

**Endpoint:** `POST /auth/register-company`
**Access:** Public

Creates a new company with initial store and admin user in a single atomic transaction.

**Request Body:**
```json
{
  "company": {
    "companyCode": "KOPI",          // Optional: Auto-generated if not provided
    "companyName": "Kopi Nusantara", // Required
    "ownerName": "Budi Santoso",     // Optional
    "ownerEmail": "budi@example.com", // Optional
    "ownerPhone": "+62123456789",    // Optional
    "address": "Jl. Sudirman No. 123", // Optional
    "city": "Jakarta",               // Optional
    "province": "DKI Jakarta",       // Optional
    "postalCode": "12190",           // Optional
    "country": "Indonesia",          // Optional (default: Indonesia)
    "taxId": "01.234.567.8-901.000"  // Optional
  },
  "store": {
    "name": "Cabang Sudirman",       // Required
    "email": "sudirman@example.com", // Optional
    "phone": "+62218765432",         // Optional
    "address": "Jl. Sudirman No. 123", // Optional
    "city": "Jakarta",               // Optional
    "province": "DKI Jakarta",       // Optional
    "postalCode": "12190",           // Optional
    "country": "Indonesia"           // Optional
  },
  "admin": {
    "username": "budi.admin",        // Required (unique per store)
    "password": "Admin123!",         // Required (min 8 chars, uppercase, lowercase, number)
    "fullName": "Budi Santoso",      // Required
    "email": "budi@example.com"      // Required (unique per store)
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Company registered successfully",
  "data": {
    "company": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "companyCode": "KOPI",
      "companyName": "Kopi Nusantara"
    },
    "store": {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "code": "KOPI-CABANGSUDI",
      "name": "Cabang Sudirman"
    },
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440101",
      "username": "budi.admin",
      "email": "budi@example.com",
      "fullName": "Budi Santoso",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid company code format
- `409 Conflict` - Company code or username already exists

---

### Suggest Company Code

**Endpoint:** `POST /auth/suggest-company-code`
**Access:** Public

Get smart company code suggestions based on company name.

**Request Body:**
```json
{
  "companyName": "Warung Kopi Saya"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "companyName": "Warung Kopi Saya",
    "recommended": "WARU",
    "isUnique": true,
    "strategy": "first-chars",
    "alternatives": [
      {
        "code": "WKS",
        "available": true,
        "description": "Available alternative"
      }
    ]
  }
}
```

**Strategies:**
- `first-chars` - First 4 alphanumeric characters
- `acronym` - First letter of each word
- `auto-suffix` - Base code + number (e.g., "WAR2", "WAR3")

---

### Check Company Code Availability

**Endpoint:** `GET /auth/check-company-code/:code`
**Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "companyCode": "KOPI",
    "available": false
  }
}
```

---

### Check Username Availability

**Endpoint:** `GET /auth/check-username/:username`
**Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "username": "budi.admin",
    "available": false
  }
}
```

---

### Login

**Endpoint:** `POST /auth/login`
**Access:** Public

**Request Body:**
```json
{
  "username": "budi.admin",
  "password": "Admin123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440101",
      "storeId": "550e8400-e29b-41d4-a716-446655440011",
      "username": "budi.admin",
      "email": "budi@example.com",
      "fullName": "Budi Santoso",
      "role": "admin",
      "isActive": true,
      "store": {
        "id": "550e8400-e29b-41d4-a716-446655440011",
        "companyId": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Kopi Nusantara Sudirman",
        "code": "KOPI-SUDIRMAN"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**JWT Payload:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440101",
  "storeId": "550e8400-e29b-41d4-a716-446655440011",
  "companyId": "550e8400-e29b-41d4-a716-446655440001",
  "role": "admin",
  "iat": 1765085569,
  "exp": 1765114369
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials

---

## User Management

All user management endpoints require authentication and appropriate role permissions.

### List Users

**Endpoint:** `GET /users`
**Access:** Admin, Manager
**Query Parameters:**
- `search` - Search across username, email, full name
- `role` - Filter by role (admin/manager/staff)
- `isActive` - Filter by status (true/false)
- `sortBy` - Sort field and order (e.g., "username:asc", "createdAt:desc")
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440101",
      "username": "budi.admin",
      "email": "budi@example.com",
      "fullName": "Budi Santoso",
      "role": "admin",
      "isActive": true,
      "createdAt": "2025-12-07T05:45:12.133Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalRecords": 3,
    "totalPages": 1
  }
}
```

---

### Create User

**Endpoint:** `POST /users`
**Access:** Admin only

**Request Body:**
```json
{
  "username": "john.staff",
  "password": "SecurePass123!",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "staff"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440106",
    "username": "john.staff",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "staff",
    "isActive": true
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error (weak password, invalid email, etc.)
- `409 Conflict` - Username or email already exists

---

### Get User Details

**Endpoint:** `GET /users/:id`
**Access:** Admin, Manager

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440101",
    "username": "budi.admin",
    "email": "budi@example.com",
    "fullName": "Budi Santoso",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-12-07T05:45:12.133Z",
    "updatedAt": "2025-12-07T05:45:12.133Z"
  }
}
```

---

### Update User

**Endpoint:** `PUT /users/:id`
**Access:** Admin only

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "fullName": "Budi Santoso Updated"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440101",
    "username": "budi.admin",
    "email": "newemail@example.com",
    "fullName": "Budi Santoso Updated"
  }
}
```

---

### Delete User

**Endpoint:** `DELETE /users/:id`
**Access:** Admin only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Cannot delete the last admin in store

---

### Change User Role

**Endpoint:** `PATCH /users/:id/role`
**Access:** Admin only

**Request Body:**
```json
{
  "role": "manager"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440102",
    "username": "siti.manager",
    "role": "manager"
  }
}
```

---

### Reset User Password

**Endpoint:** `PATCH /users/:id/password`
**Access:** Admin only

**Request Body:**
```json
{
  "newPassword": "NewSecurePass456!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### Deactivate User

**Endpoint:** `PATCH /users/:id/deactivate`
**Access:** Admin only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```

---

### Activate User

**Endpoint:** `PATCH /users/:id/activate`
**Access:** Admin only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User activated successfully"
}
```

---

### Get User Statistics

**Endpoint:** `GET /users/stats`
**Access:** Admin only

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "active": 5,
    "inactive": 0,
    "byRole": {
      "admin": 2,
      "manager": 2,
      "staff": 1
    }
  }
}
```

---

## Materials Management

### List Materials

**Endpoint:** `GET /materials`
**Access:** All authenticated users
**Query Parameters:**
- `search` - Search across SKU and name
- `sku` - Exact SKU filter
- `name` - Partial name filter
- `category` - Category filter
- `unit` - Unit filter
- `isActive` - Active status filter (true/false)
- `lowStockOnly` - Show only low stock items (true/false)
- `minStock` - Minimum stock filter
- `maxStock` - Maximum stock filter
- `sortBy` - Sort field:order (e.g., "name:asc", "currentStock:desc")
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440201",
      "materialCode": "20000001",
      "sku": "COFFEEARABICA",
      "name": "Coffee Beans Arabica",
      "description": "Premium Arabica coffee beans from Gayo, Aceh",
      "category": "Coffee Beans",
      "unit": "kg",
      "currentStock": "50.0000",
      "minimumStock": "10.0000",
      "unitCost": "180000.00",
      "isActive": true,
      "createdAt": "2025-12-07T05:45:12.133Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalRecords": 10,
    "totalPages": 1
  }
}
```

---

### Create Material

**Endpoint:** `POST /materials`
**Access:** Admin, Manager

**Request Body:**
```json
{
  "sku": "CUPPLASTIK16OZ",
  "name": "Cup Plastik 16oz",
  "description": "Disposable plastic cup for cold drinks",
  "category": "Packaging",
  "unit": "pcs",
  "currentStock": 500,
  "minimumStock": 100,
  "unitCost": 1500
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Material created successfully",
  "data": {
    "id": "f4eac685-837d-4054-96ef-326fd25a29e4",
    "materialCode": "20000001",
    "sku": "CUPPLASTIK16OZ",
    "name": "Cup Plastik 16oz",
    "description": "Disposable plastic cup for cold drinks",
    "category": "Packaging",
    "unit": "pcs",
    "currentStock": "500.0000",
    "minimumStock": "100.0000",
    "unitCost": "1500.00",
    "isActive": true
  }
}
```

**Note:** `materialCode` is auto-generated using SAP-style numbering (20000001, 20000002, etc.)

---

### Get Material Details

**Endpoint:** `GET /materials/:id`
**Access:** All authenticated users

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440201",
    "materialCode": "20000001",
    "sku": "COFFEEARABICA",
    "name": "Coffee Beans Arabica",
    "description": "Premium Arabica coffee beans from Gayo, Aceh",
    "category": "Coffee Beans",
    "unit": "kg",
    "currentStock": "50.0000",
    "minimumStock": "10.0000",
    "unitCost": "180000.00",
    "isActive": true
  }
}
```

---

### Update Material

**Endpoint:** `PUT /materials/:id`
**Access:** Admin, Manager

**Request Body:**
```json
{
  "name": "Coffee Beans Arabica Premium",
  "unitCost": 190000
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Material updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440201",
    "materialCode": "20000001",
    "sku": "COFFEEARABICA",
    "name": "Coffee Beans Arabica Premium",
    "unitCost": "190000.00"
  }
}
```

---

### Delete Material

**Endpoint:** `DELETE /materials/:id`
**Access:** Admin only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Material deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Cannot delete material with remaining stock or used in BOM

---

## Products Management

### List Products

**Endpoint:** `GET /products`
**Access:** All authenticated users
**Query Parameters:**
- `search` - Search across SKU and name
- `category` - Category filter
- `activeOnly` - Show only active products (default: true)
- `sortBy` - Sort field (name/sku/sellingPrice/createdAt)
- `order` - Sort order (asc/desc, default: asc)
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440301",
      "productCode": "10000001",
      "sku": "ESPRESSO",
      "name": "Espresso",
      "description": "Single shot espresso",
      "category": "Hot Coffee",
      "unit": "cup",
      "currentStock": "0.0000",
      "costPrice": "8000.00",
      "sellingPrice": "15000.00",
      "isActive": true,
      "createdAt": "2025-12-07T05:45:12.133Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalRecords": 5,
    "totalPages": 1
  }
}
```

---

### Create Product

**Endpoint:** `POST /products`
**Access:** Admin, Manager

**Request Body:**
```json
{
  "sku": "CAPPUCCINO",
  "name": "Cappuccino",
  "description": "Espresso with steamed milk and foam",
  "category": "Hot Coffee",
  "unit": "cup",
  "sellingPrice": 22000,
  "costPrice": 12000
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "c7b38f5d-8861-4215-ab5e-995253dd1c50",
    "productCode": "10000001",
    "sku": "CAPPUCCINO",
    "name": "Cappuccino",
    "description": "Espresso with steamed milk and foam",
    "category": "Hot Coffee",
    "unit": "cup",
    "currentStock": "0.0000",
    "costPrice": "12000.00",
    "sellingPrice": "22000.00",
    "isActive": true
  }
}
```

**Note:** `productCode` is auto-generated using SAP-style numbering (10000001, 10000002, etc.)

---

### Get Product Details

**Endpoint:** `GET /products/:id`
**Access:** All authenticated users

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440301",
    "productCode": "10000001",
    "sku": "ESPRESSO",
    "name": "Espresso",
    "description": "Single shot espresso",
    "category": "Hot Coffee",
    "unit": "cup",
    "sellingPrice": "15000.00",
    "costPrice": "8000.00"
  }
}
```

---

### Update Product

**Endpoint:** `PUT /products/:id`
**Access:** Admin, Manager

**Request Body:**
```json
{
  "sellingPrice": 16000,
  "description": "Single shot premium espresso"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440301",
    "productCode": "10000001",
    "sku": "ESPRESSO",
    "name": "Espresso",
    "sellingPrice": "16000.00"
  }
}
```

---

### Delete Product

**Endpoint:** `DELETE /products/:id`
**Access:** Admin only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Calculate Product Cost

**Endpoint:** `GET /products/:id/cost`
**Access:** Admin, Manager

Calculates product cost from BOM (Bill of Materials).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "productId": "550e8400-e29b-41d4-a716-446655440302",
    "productName": "Cappuccino",
    "totalCost": 4900.00,
    "breakdown": [
      {
        "materialCode": "20000001",
        "materialName": "Coffee Beans Arabica",
        "quantity": 0.015,
        "unit": "kg",
        "unitCost": 180000.00,
        "totalCost": 2700.00
      },
      {
        "materialCode": "20000003",
        "materialName": "Full Cream Milk",
        "quantity": 0.1,
        "unit": "liter",
        "unitCost": 15000.00,
        "totalCost": 1500.00
      },
      {
        "materialCode": "20000007",
        "materialName": "Paper Cup 8oz",
        "quantity": 1,
        "unit": "pcs",
        "unitCost": 2000.00,
        "totalCost": 2000.00
      }
    ]
  }
}
```

---

## Bill of Materials (BOM)

### Get Product BOM

**Endpoint:** `GET /products/:productId/materials`
**Access:** All authenticated users

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "productId": "550e8400-e29b-41d4-a716-446655440302",
    "productName": "Cappuccino",
    "materials": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440403",
        "materialId": "550e8400-e29b-41d4-a716-446655440201",
        "materialCode": "20000001",
        "materialName": "Coffee Beans Arabica",
        "sku": "COFFEEARABICA",
        "quantity": "0.0150",
        "unit": "kg",
        "notes": null
      }
    ]
  }
}
```

---

### Add Material to BOM

**Endpoint:** `POST /products/:productId/materials`
**Access:** Admin, Manager

**Request Body:**
```json
{
  "materialId": "550e8400-e29b-41d4-a716-446655440201",
  "quantity": 0.015,
  "unit": "kg",
  "notes": "Single shot"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Material added to BOM successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440403",
    "productId": "550e8400-e29b-41d4-a716-446655440301",
    "materialId": "550e8400-e29b-41d4-a716-446655440201",
    "quantity": "0.0150",
    "unit": "kg",
    "notes": "Single shot"
  }
}
```

---

### Update BOM Entry

**Endpoint:** `PUT /bom/:bomId`
**Access:** Admin, Manager

**Request Body:**
```json
{
  "quantity": 0.02,
  "notes": "Double shot"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "BOM entry updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440403",
    "quantity": "0.0200",
    "notes": "Double shot"
  }
}
```

---

### Delete BOM Entry

**Endpoint:** `DELETE /bom/:bomId`
**Access:** Admin, Manager

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Material removed from BOM successfully"
}
```

---

### Replace Entire BOM

**Endpoint:** `PUT /products/:productId/materials`
**Access:** Admin, Manager

Replaces all BOM entries for a product in a single atomic transaction.

**Request Body:**
```json
{
  "materials": [
    {
      "materialId": "550e8400-e29b-41d4-a716-446655440201",
      "quantity": 0.015,
      "unit": "kg"
    },
    {
      "materialId": "550e8400-e29b-41d4-a716-446655440203",
      "quantity": 0.1,
      "unit": "liter"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "BOM replaced successfully",
  "data": {
    "productId": "550e8400-e29b-41d4-a716-446655440301",
    "materials": [
      {
        "id": "new-bom-id-1",
        "materialId": "550e8400-e29b-41d4-a716-446655440201",
        "quantity": "0.0150",
        "unit": "kg"
      }
    ]
  }
}
```

---

### Get Material Usage

**Endpoint:** `GET /materials/:materialId/usage`
**Access:** All authenticated users

Shows which products use this material.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "materialId": "550e8400-e29b-41d4-a716-446655440201",
    "materialName": "Coffee Beans Arabica",
    "usedIn": [
      {
        "productId": "550e8400-e29b-41d4-a716-446655440301",
        "productCode": "10000001",
        "productName": "Espresso",
        "quantity": "0.0100",
        "unit": "kg"
      },
      {
        "productId": "550e8400-e29b-41d4-a716-446655440302",
        "productCode": "10000002",
        "productName": "Cappuccino",
        "quantity": "0.0150",
        "unit": "kg"
      }
    ]
  }
}
```

---

## Stock Transactions

### List Stock Transactions

**Endpoint:** `GET /stock-transactions`
**Access:** All authenticated users
**Query Parameters:**
- `materialId` - Filter by material
- `type` - Transaction type (IN/OUT/ADJUSTMENT)
- `startDate` - Start date filter (YYYY-MM-DD)
- `endDate` - End date filter (YYYY-MM-DD)
- `page` - Page number
- `limit` - Records per page

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "txn-uuid-1",
      "materialId": "550e8400-e29b-41d4-a716-446655440201",
      "materialCode": "20000001",
      "materialName": "Coffee Beans Arabica",
      "type": "IN",
      "quantity": "10.0000",
      "unit": "kg",
      "unitCost": "180000.00",
      "totalCost": "1800000.00",
      "reference": "PO-2025-001",
      "notes": "Purchase from supplier",
      "createdAt": "2025-12-07T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalRecords": 5,
    "totalPages": 1
  }
}
```

---

### Create Stock Transaction

**Endpoint:** `POST /stock-transactions`
**Access:** Admin, Manager

**Request Body:**
```json
{
  "materialId": "550e8400-e29b-41d4-a716-446655440201",
  "type": "IN",
  "quantity": 10,
  "unitCost": 180000,
  "reference": "PO-2025-001",
  "notes": "Purchase from supplier"
}
```

**Transaction Types:**
- `IN` - Stock increase (purchase, production, etc.)
- `OUT` - Stock decrease (sale, usage, etc.)
- `ADJUSTMENT` - Stock correction

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Stock transaction created successfully",
  "data": {
    "id": "txn-uuid-1",
    "materialId": "550e8400-e29b-41d4-a716-446655440201",
    "type": "IN",
    "quantity": "10.0000",
    "unitCost": "180000.00",
    "totalCost": "1800000.00",
    "newStock": "60.0000"
  }
}
```

---

### Get Material Transaction History

**Endpoint:** `GET /materials/:id/transactions`
**Access:** All authenticated users

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "materialId": "550e8400-e29b-41d4-a716-446655440201",
    "materialName": "Coffee Beans Arabica",
    "currentStock": "60.0000",
    "transactions": [
      {
        "id": "txn-uuid-1",
        "type": "IN",
        "quantity": "10.0000",
        "unitCost": "180000.00",
        "reference": "PO-2025-001",
        "createdAt": "2025-12-07T10:30:00.000Z"
      }
    ]
  }
}
```

---

## Inventory Management

### Stock Count (Physical Count)

**Endpoint:** `POST /inventory/stock-count`
**Access:** Admin, Manager

Record physical stock count and adjust system stock.

**Request Body:**
```json
{
  "materialId": "550e8400-e29b-41d4-a716-446655440201",
  "physicalCount": 48.5,
  "notes": "Monthly stock opname"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stock count recorded successfully",
  "data": {
    "materialId": "550e8400-e29b-41d4-a716-446655440201",
    "systemStock": "50.0000",
    "physicalCount": "48.5000",
    "variance": "-1.5000",
    "newStock": "48.5000"
  }
}
```

---

### Record Damage/Loss

**Endpoint:** `POST /inventory/damage`
**Access:** Admin, Manager

**Request Body:**
```json
{
  "materialId": "550e8400-e29b-41d4-a716-446655440201",
  "quantity": 2,
  "reason": "Expired stock",
  "notes": "Remove expired coffee beans"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Damage/loss recorded successfully",
  "data": {
    "materialId": "550e8400-e29b-41d4-a716-446655440201",
    "quantity": "2.0000",
    "reason": "Expired stock",
    "newStock": "46.5000"
  }
}
```

---

### Bulk Stock Adjustment

**Endpoint:** `POST /inventory/bulk-adjustment`
**Access:** Admin only

**Request Body:**
```json
{
  "adjustments": [
    {
      "materialId": "550e8400-e29b-41d4-a716-446655440201",
      "quantity": 50,
      "notes": "Initial stock"
    },
    {
      "materialId": "550e8400-e29b-41d4-a716-446655440202",
      "quantity": 30,
      "notes": "Initial stock"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bulk adjustment completed successfully",
  "data": {
    "adjusted": 2,
    "results": [
      {
        "materialId": "550e8400-e29b-41d4-a716-446655440201",
        "newStock": "50.0000"
      }
    ]
  }
}
```

---

### Get Current Stock Levels

**Endpoint:** `GET /inventory/stock-levels`
**Access:** All authenticated users
**Query Parameters:**
- `lowStockOnly` - Show only items below minimum stock
- `category` - Filter by category

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "materialId": "550e8400-e29b-41d4-a716-446655440201",
      "materialCode": "20000001",
      "materialName": "Coffee Beans Arabica",
      "sku": "COFFEEARABICA",
      "currentStock": "50.0000",
      "minimumStock": "10.0000",
      "unit": "kg",
      "status": "OK",
      "variance": "40.0000"
    }
  ]
}
```

**Stock Status:**
- `OK` - Above minimum stock
- `LOW` - Below minimum stock
- `CRITICAL` - At or below 50% of minimum stock

---

### Get Inventory Valuation

**Endpoint:** `GET /inventory/valuation`
**Access:** Admin, Manager

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalValue": 12500000.00,
    "materials": [
      {
        "materialId": "550e8400-e29b-41d4-a716-446655440201",
        "materialCode": "20000001",
        "materialName": "Coffee Beans Arabica",
        "currentStock": "50.0000",
        "unitCost": "180000.00",
        "totalValue": "9000000.00"
      }
    ]
  }
}
```

---

## Reports

### Low Stock Report

**Endpoint:** `GET /reports/low-stock`
**Access:** Admin, Manager

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "materialId": "550e8400-e29b-41d4-a716-446655440205",
      "materialCode": "20000005",
      "materialName": "Palm Sugar (Gula Aren)",
      "sku": "SUGARPALMSUGAR",
      "currentStock": "3.0000",
      "minimumStock": "5.0000",
      "unit": "kg",
      "deficit": "-2.0000",
      "priority": "HIGH"
    }
  ]
}
```

**Priority Levels:**
- `CRITICAL` - Stock at 0 or below 50% of minimum
- `HIGH` - Stock below minimum
- `MEDIUM` - Stock at minimum

---

### Stock Movement Report

**Endpoint:** `GET /reports/stock-movement`
**Access:** Admin, Manager
**Query Parameters:**
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `materialId` - Filter by material

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2025-12-01",
      "endDate": "2025-12-07"
    },
    "summary": {
      "totalIn": "100.0000",
      "totalOut": "45.0000",
      "netChange": "55.0000"
    },
    "movements": [
      {
        "materialId": "550e8400-e29b-41d4-a716-446655440201",
        "materialName": "Coffee Beans Arabica",
        "openingStock": "40.0000",
        "stockIn": "20.0000",
        "stockOut": "10.0000",
        "closingStock": "50.0000"
      }
    ]
  }
}
```

---

### Material Consumption Report

**Endpoint:** `GET /reports/material-consumption`
**Access:** Admin, Manager
**Query Parameters:**
- `startDate` - Start date
- `endDate` - End date
- `category` - Filter by category

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2025-12-01",
      "endDate": "2025-12-07"
    },
    "consumption": [
      {
        "materialId": "550e8400-e29b-41d4-a716-446655440201",
        "materialCode": "20000001",
        "materialName": "Coffee Beans Arabica",
        "totalConsumed": "15.5000",
        "unit": "kg",
        "totalCost": "2790000.00",
        "averageDailyConsumption": "2.2143"
      }
    ],
    "summary": {
      "totalMaterials": 10,
      "totalCost": 5500000.00
    }
  }
}
```

---

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Validation error or invalid request
- `401 Unauthorized` - Authentication required or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (e.g., username exists)
- `500 Internal Server Error` - Server error

### Common Error Messages

**Authentication Errors:**
- `"Authentication token is required"` - No token provided
- `"Invalid or expired token"` - Token is invalid
- `"Invalid credentials"` - Wrong username/password

**Authorization Errors:**
- `"Access denied. Admin role required"` - Insufficient permissions
- `"Cannot access resources from another store"` - Multi-tenancy violation

**Validation Errors:**
- `"SKU must be uppercase"` - Field format error
- `"Password must be at least 8 characters"` - Validation rule violation
- `"Material code must be 8 digits starting with 2"` - Code format error

**Business Logic Errors:**
- `"Cannot delete material with remaining stock"` - Business rule violation
- `"Insufficient stock for this operation"` - Stock constraint
- `"Cannot delete the last admin in store"` - System integrity protection

---

## Demo Credentials

### Company 1: Kopi Nusantara (Multi-store chain)

**Store 1: Kopi Nusantara Sudirman**
- Username: `budi.admin`
- Password: `Admin123!`
- Role: Admin

- Username: `siti.manager`
- Password: `Admin123!`
- Role: Manager

- Username: `agus.staff`
- Password: `Admin123!`
- Role: Staff

**Store 2: Kopi Nusantara Thamrin**
- Username: `dewi.manager`
- Password: `Admin123!`
- Role: Manager

### Company 2: Warung Kopi Saya (Single store)

**Store: Warung Kopi Saya Braga**
- Username: `andi.admin`
- Password: `Admin123!`
- Role: Admin

---

## Authentication Flow Example

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'budi.admin',
    password: 'Admin123!'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// 2. Use token for authenticated requests
const materialsResponse = await fetch('http://localhost:3000/api/v1/materials', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const materials = await materialsResponse.json();
```

---

## Multi-Tenancy Notes

- All data is automatically scoped to the authenticated user's store
- Users can only access data from their own store
- Company-level features (like material/product codes) are shared across stores in the same company
- Material codes (20000001+) are company-scoped, not store-scoped
- Product codes (10000001+) are company-scoped, not store-scoped

---

## Code Format Reference

### Material Codes
- Format: 8 digits starting with 2
- Example: `20000001`, `20000002`, `20000003`
- Scope: Company-wide (shared across all stores in company)
- Auto-generated on material creation

### Product Codes
- Format: 8 digits starting with 1
- Example: `10000001`, `10000002`, `10000003`
- Scope: Company-wide (shared across all stores in company)
- Auto-generated on product creation

### Company Codes
- Format: 2-4 uppercase alphanumeric characters
- Example: `KOPI`, `WARU`, `REST`
- Scope: Globally unique across all companies
- Generated strategies: first-chars, acronym, auto-suffix

### Store Codes
- Format: `{COMPANY_CODE}-{STORE_NAME}`
- Example: `KOPI-SUDIRMAN`, `WARU-BRAGA`
- Scope: Globally unique
- Auto-generated from company code + store name

---

## Notes for Frontend Developers

1. **Always include Authorization header** for protected endpoints
2. **UUIDs are used for all IDs** - they are 36-character strings, not integers
3. **Material/Product codes are for display** - use UUID `id` for API calls
4. **All decimal fields** (prices, quantities) are returned as strings to prevent floating-point errors
5. **Pagination is consistent** across all list endpoints
6. **Multi-tenancy is automatic** - no need to pass storeId in requests
7. **Roles matter** - Check user role before showing admin/manager features
8. **Stock operations** create immutable audit trails - transactions cannot be edited/deleted

---

**Last Updated:** December 7, 2025
**API Version:** 1.0.0
**Contact:** For issues or questions, check the Swagger documentation at `/api-docs`
