# Cognova P1 Backend API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

This API uses JWT tokens stored in HTTP-only cookies. After login/register, the token is automatically set in cookies and will be sent with subsequent requests.

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "username123",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-15"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "username": "username123",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

### 2. Login User

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "username": "username123",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

### 3. Google Sign-in

**POST** `/auth/google-signin`

**Request Body:**

```json
{
  "idToken": "firebase-id-token-here"
}
```

**Response:**

```json
{
  "message": "Google sign-in successful",
  "user": {
    "user_id": "uuid-here",
    "email": "user@gmail.com",
    "username": "user",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

### 4. Get User Profile

**GET** `/auth/profile`
_Requires Authentication_

**Response:**

```json
{
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "username": "username123",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-15T00:00:00.000Z",
    "created_at": "2025-09-01T10:00:00.000Z",
    "is_active": true
  }
}
```

---

### 5. Update Profile

**PUT** `/auth/profile`
_Requires Authentication_

**Request Body:**

```json
{
  "username": "newusername",
  "first_name": "Jane",
  "last_name": "Smith",
  "date_of_birth": "1992-03-20"
}
```

**Response:**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "username": "newusername",
    "first_name": "Jane",
    "last_name": "Smith",
    "date_of_birth": "1992-03-20T00:00:00.000Z",
    "created_at": "2025-09-01T10:00:00.000Z",
    "is_active": true
  }
}
```

---

### 6. Change Password

**PUT** `/auth/change-password`
_Requires Authentication_

**Request Body:**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

---

### 7. Deactivate Account

**PUT** `/auth/deactivate`
_Requires Authentication_

**Response:**

```json
{
  "message": "Account deactivated successfully"
}
```

---

### 8. Delete Account

**DELETE** `/auth/delete-account`
_Requires Authentication_

**Request Body:**

```json
{
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Account deleted successfully"
}
```

---

### 9. Logout

**POST** `/auth/logout`

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

---

## 👥 User Management Endpoints (Admin Only)

### 1. Get All Users

**GET** `/users?page=1&limit=10`
_Requires Admin Authentication_

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "users": [
    {
      "user_id": "uuid-here",
      "email": "user@example.com",
      "username": "username123",
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1990-01-15T00:00:00.000Z",
      "created_at": "2025-09-01T10:00:00.000Z",
      "is_active": true
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_users": 50,
    "has_next": true,
    "has_prev": false
  }
}
```

---

### 2. Search Users

**GET** `/users/search?query=john&page=1&limit=10`
_Requires Admin Authentication_

**Query Parameters:**

- `query` (required): Search term
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "users": [
    {
      "user_id": "uuid-here",
      "email": "john@example.com",
      "username": "john123",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2025-09-01T10:00:00.000Z",
      "is_active": true
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_users": 1,
    "query": "john"
  }
}
```

---

### 3. Get User Statistics

**GET** `/users/stats`
_Requires Admin Authentication_

**Response:**

```json
{
  "total_users": 100,
  "active_users": 95,
  "inactive_users": 5,
  "new_users_last_30_days": 25,
  "users_registered_today": 3,
  "activity_rate": "95.00"
}
```

---

### 4. Get User by ID

**GET** `/users/{userId}`
_Requires Authentication (own profile or admin)_

**Response:**

```json
{
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "username": "username123",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-15T00:00:00.000Z",
    "created_at": "2025-09-01T10:00:00.000Z",
    "is_active": true
  }
}
```

---

### 5. Update User Status

**PUT** `/users/{userId}/status`
_Requires Admin Authentication_

**Request Body:**

```json
{
  "is_active": false
}
```

**Response:**

```json
{
  "message": "User deactivated successfully",
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "username": "username123",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": false
  }
}
```

---

### 6. Admin Delete User

**DELETE** `/users/{userId}`
_Requires Admin Authentication_

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

---

## 🔧 Environment Variables Required

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=your-mongodb-connection-string

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Admin Users (comma-separated emails)
ADMIN_EMAILS=admin@yourapp.com,admin2@yourapp.com

# Firebase (for Google Sign-in)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-client-cert-url
```

---

## 📝 Testing Examples

### Register User

**Endpoint:** `POST /auth/register`
**Body:**

```json
{
  "email": "test@example.com",
  "username": "testuser",
  "password": "testpassword123",
  "first_name": "Test",
  "last_name": "User",
  "date_of_birth": "1995-05-15"
}
```

### Login User

**Endpoint:** `POST /auth/login`
**Body:**

```json
{
  "email": "test@example.com",
  "password": "testpassword123"
}
```

### Update Profile

**Endpoint:** `PUT /auth/profile`
**Body:**

```json
{
  "username": "updateduser",
  "first_name": "Updated",
  "last_name": "User"
}
```

### Change Password

**Endpoint:** `PUT /auth/change-password`
**Body:**

```json
{
  "currentPassword": "testpassword123",
  "newPassword": "newtestpassword123"
}
```

### Delete Account

**Endpoint:** `DELETE /auth/delete-account`
**Body:**

```json
{
  "password": "testpassword123"
}
```

### Update User Status (Admin)

**Endpoint:** `PUT /users/{userId}/status`
**Body:**

```json
{
  "is_active": false
}
```

---

## 📝 Notes for Postman

1. **Cookie Handling**:

   - Enable "Send cookies" in Postman settings
   - Cookies are automatically handled after login/register

2. **Admin Testing**:

   - Add your email to `ADMIN_EMAILS` in `.env`
   - Register with that email to test admin endpoints

3. **Error Responses**:

   - All errors return JSON with `message` field
   - HTTP status codes indicate error type (400, 401, 403, 404, 500)

4. **Headers**:
   - Always set `Content-Type: application/json` for POST/PUT requests
   - No need to manually set Authorization headers (cookies handle this)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpassword123",
    "first_name": "Test",
    "last_name": "User",
    "date_of_birth": "1995-05-15"
  }' \
  -c cookies.txt \
  -v
```

---

### 2. Login User

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "username": "username123",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Postman cURL:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }' \
  -c cookies.txt \
  -v
```

---

### 3. Google Sign-in

**POST** `/auth/google-signin`

**Request Body:**

```json
{
  "idToken": "firebase-id-token-here"
}
```

**Response:**

```json
{
  "message": "Google sign-in successful",
  "user": {
    "user_id": "uuid-here",
    "email": "user@gmail.com",
    "username": "user",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Postman cURL:**

```bash
curl -X POST http://localhost:5000/api/auth/google-signin \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "your-firebase-id-token"
  }' \
  -c cookies.txt \
  -v
```

---

### 4. Get User Profile

**GET** `/auth/profile`
_Requires Authentication_

**Response:**

```json
{
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "username": "username123",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-15T00:00:00.000Z",
    "created_at": "2025-09-01T10:00:00.000Z",
    "is_active": true
  }
}
```

**Postman cURL:**

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -b cookies.txt \
  -v
```

---

### 5. Update Profile

**PUT** `/auth/profile`
_Requires Authentication_

**Request Body:**

```json
{
  "username": "newusername",
  "first_name": "Jane",
  "last_name": "Smith",
  "date_of_birth": "1992-03-20"
}
```

**Response:**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "username": "newusername",
    "first_name": "Jane",
    "last_name": "Smith",
    "date_of_birth": "1992-03-20T00:00:00.000Z",
    "created_at": "2025-09-01T10:00:00.000Z",
    "is_active": true
  }
}
```

**Postman cURL:**

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updateduser",
    "first_name": "Updated",
    "last_name": "User"
  }' \
  -b cookies.txt \
  -v
```

---

### 6. Change Password

**PUT** `/auth/change-password`
_Requires Authentication_

**Request Body:**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

**Postman cURL:**

```bash
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "testpassword123",
    "newPassword": "newtestpassword123"
  }' \
  -b cookies.txt \
  -v
```

---

### 7. Deactivate Account

**PUT** `/auth/deactivate`
_Requires Authentication_

**Response:**

```json
{
  "message": "Account deactivated successfully"
}
```

**Postman cURL:**

```bash
curl -X PUT http://localhost:5000/api/auth/deactivate \
  -b cookies.txt \
  -v
```

---

### 8. Delete Account

**DELETE** `/auth/delete-account`
_Requires Authentication_

**Request Body:**

```json
{
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Account deleted successfully"
}
```

**Postman cURL:**

```bash
curl -X DELETE http://localhost:5000/api/auth/delete-account \
  -H "Content-Type: application/json" \
  -d '{
    "password": "testpassword123"
  }' \
  -b cookies.txt \
  -v
```

---

### 9. Logout

**POST** `/auth/logout`

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

**Postman cURL:**

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt \
  -v
```

---

## 👥 User Management Endpoints (Admin Only)

### 1. Get All Users

**GET** `/users?page=1&limit=10`
_Requires Admin Authentication_

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "users": [
    {
      "user_id": "uuid-here",
      "email": "user@example.com",
      "username": "username123",
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1990-01-15T00:00:00.000Z",
      "created_at": "2025-09-01T10:00:00.000Z",
      "is_active": true
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_users": 50,
    "has_next": true,
    "has_prev": false
  }
}
```

**Postman cURL:**

```bash
curl -X GET "http://localhost:5000/api/users?page=1&limit=5" \
  -b cookies.txt \
  -v
```

---

### 2. Search Users

**GET** `/users/search?query=john&page=1&limit=10`
_Requires Admin Authentication_

**Query Parameters:**

- `query` (required): Search term
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "users": [
    {
      "user_id": "uuid-here",
      "email": "john@example.com",
      "username": "john123",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2025-09-01T10:00:00.000Z",
      "is_active": true
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_users": 1,
    "query": "john"
  }
}
```

**Postman cURL:**

```bash
curl -X GET "http://localhost:5000/api/users/search?query=test&page=1&limit=10" \
  -b cookies.txt \
  -v
```

---

### 3. Get User Statistics

**GET** `/users/stats`
_Requires Admin Authentication_

**Response:**

```json
{
  "total_users": 100,
  "active_users": 95,
  "inactive_users": 5,
  "new_users_last_30_days": 25,
  "users_registered_today": 3,
  "activity_rate": "95.00"
}
```

**Postman cURL:**

```bash
curl -X GET http://localhost:5000/api/users/stats \
  -b cookies.txt \
  -v
```

---

### 4. Get User by ID

**GET** `/users/{userId}`
_Requires Authentication (own profile or admin)_

**Response:**

```json
{
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "username": "username123",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-15T00:00:00.000Z",
    "created_at": "2025-09-01T10:00:00.000Z",
    "is_active": true
  }
}
```

**Postman cURL:**

```bash
curl -X GET http://localhost:5000/api/users/your-user-id-here \
  -b cookies.txt \
  -v
```

---

### 5. Update User Status

**PUT** `/users/{userId}/status`
_Requires Admin Authentication_

**Request Body:**

```json
{
  "is_active": false
}
```

**Response:**

```json
{
  "message": "User deactivated successfully",
  "user": {
    "user_id": "uuid-here",
    "email": "user@example.com",
    "username": "username123",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": false
  }
}
```

**Postman cURL:**

```bash
curl -X PUT http://localhost:5000/api/users/user-id-here/status \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false
  }' \
  -b cookies.txt \
  -v
```

---

### 6. Admin Delete User

**DELETE** `/users/{userId}`
_Requires Admin Authentication_

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

**Postman cURL:**

```bash
curl -X DELETE http://localhost:5000/api/users/user-id-here \
  -b cookies.txt \
  -v
```

---

## 🔧 Environment Variables Required

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=your-mongodb-connection-string

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Admin Users (comma-separated emails)
ADMIN_EMAILS=admin@yourapp.com,admin2@yourapp.com

# Firebase (for Google Sign-in)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-client-cert-url
```

---

## 🧪 Testing Flow with Postman

### Step 1: Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpassword123",
    "first_name": "Test",
    "last_name": "User"
  }' \
  -c cookies.txt \
  -v
```

### Step 2: Get Profile (using cookies)

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -b cookies.txt \
  -v
```

### Step 3: Update Profile

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updateduser",
    "first_name": "Updated"
  }' \
  -b cookies.txt \
  -v
```

### Step 4: Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt \
  -v
```

---

## 📝 Notes for Postman

1. **Cookie Handling**:

   - Enable "Send cookies" in Postman settings
   - Cookies are automatically handled after login/register

2. **Admin Testing**:

   - Add your email to `ADMIN_EMAILS` in `.env`
   - Register with that email to test admin endpoints

3. **Error Responses**:

   - All errors return JSON with `message` field
   - HTTP status codes indicate error type (400, 401, 403, 404, 500)

4. **Headers**:
   - Always set `Content-Type: application/json` for POST/PUT requests
   - No need to manually set Authorization headers (cookies handle this)
