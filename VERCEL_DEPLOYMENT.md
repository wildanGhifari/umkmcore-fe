# Vercel Deployment Instructions

This document explains how to configure the frontend to connect to the backend API when deployed on Vercel.

## Environment Variable Setup

The frontend needs to know where the backend API is located. This is configured using the `VITE_API_BASE_URL` environment variable.

### Step 1: Add Environment Variable in Vercel

1. Go to your Vercel project dashboard: https://vercel.com/your-project
2. Click on **Settings**
3. Click on **Environment Variables** in the left sidebar
4. Add a new environment variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `http://72.60.79.179/api/v1`
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

### Step 2: Redeploy

After adding the environment variable:
1. Go to the **Deployments** tab
2. Click the **⋯** (three dots) menu on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (optional, for faster builds)
5. Click **Redeploy**

Alternatively, just push a new commit to GitHub and Vercel will automatically redeploy with the new environment variable.

## How It Works

The frontend uses this environment variable in all service files:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const API_URL = `${API_BASE_URL}/materials`;
```

- **In production (Vercel)**: Uses `http://72.60.79.179/api/v1` from the environment variable
- **In local development**: Falls back to `/api/v1` (relative URL for local proxy)

## Local Development

For local development, create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=http://72.60.79.179/api/v1
```

This file is gitignored and won't be committed to the repository.

## Troubleshooting

### Issue: API calls fail with 404 or network errors

**Solution**: Make sure you've added the `VITE_API_BASE_URL` environment variable in Vercel and redeployed.

### Issue: CORS errors

**Solution**: The backend needs to allow requests from your Vercel domain. Check the backend's CORS configuration.

### Issue: Environment variable not updating

**Solution**:
1. Delete the old environment variable in Vercel
2. Add it again with the correct value
3. Trigger a new deployment (not just redeploy)

## Backend URL

Current backend API is hosted at:
- **Base URL**: `http://72.60.79.179`
- **API Base**: `http://72.60.79.179/api/v1`

If the backend URL changes, update the `VITE_API_BASE_URL` environment variable in Vercel.
