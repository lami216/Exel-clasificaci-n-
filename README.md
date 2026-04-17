# Excel-to-Product-Catalog-to-Excel Platform (MERN, JavaScript)

This repository contains a full-stack platform for importing supplier Excel files, mapping messy headers into a fixed schema, storing product rows as reusable MongoDB products, showing a catalog UI, selecting product quantities, and exporting a new Excel file for selected products.

## Structure

- `backend/` Express + MongoDB + Mongoose + ExcelJS + ImageKit
- `frontend/` React + Vite + JavaScript

## Fixed Internal Schema

- NO
- PICTURE
- NAME
- CARTON_QTY
- PCS
- PRICE
- TOTAL_PRICE
- cbm
- cbms
- kg
- kgs
- السعر بالاوقية
- نسبة المكتب
- الشحن
- سعر الطياح

## Features implemented

- JWT admin auth (`/api/auth/login`, `/api/auth/me`)
- Excel import flow:
  - Upload batch
  - Preview with header detection
  - Candidate header rows + auto mapping suggestions
  - Manual mapping confirmation
  - Product extraction and DB save
- Product CRUD and image upload (ImageKit)
- Catalog page with search + product selection
- Selection submission + Excel export generation/download URL
- Import batch history

## Setup

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Important environment variables

### Backend (`backend/.env`)

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_URL_ENDPOINT`
- `CLIENT_URL`

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL`
- `VITE_IMAGEKIT_URL_ENDPOINT`

## API overview

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/import/upload`
- `POST /api/import/preview`
- `POST /api/import/confirm`
- `GET /api/import/batches`
- `GET /api/import/batches/:id`
- `GET /api/products`
- `GET /api/products/:id`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/:id/upload-image`
- `POST /api/selections`
- `GET /api/selections/:id`
- `POST /api/selections/:id/export`
- `GET /api/exports/:id/download`

## Notes

- Arabic fields are preserved end-to-end via explicit model fields and mapping.
- Header detection rejects numeric-like rows (`7`, `300*18`, `48`, `3.8`) to reduce false header detection.
- Embedded Excel images extraction is not guaranteed by all suppliers/files, but model + service layers are structured to extend image extraction later.
