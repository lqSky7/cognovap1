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

5. **Stream Management Testing**:
   - Test `/conversations/streams/active` to check active streams
   - Use stream cancellation during long responses  
   - **Important**: Route order matters - `/streams/active` must come before `/:conversationId` routes in Express router

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

## � Journal Endpoints

### 1. Create Journal Entry

**POST** `/journal`
_Requires Authentication_

**Request Body:**

```json
{
  "title": "My Day",
  "content": "Today was a good day. I felt happy and accomplished several tasks.",
  "mood_score": 8,
  "tags": ["happy", "productive"],
  "entry_date": "2025-09-01",
  "accessible_in_chat": true
}
```

**Response:**

```json
{
  "message": "Journal entry created successfully",
  "entry": {
    "entry_id": "uuid-here",
    "user_id": "user-uuid",
    "title": "My Day",
    "content": "Today was a good day...",
    "mood_score": 8,
    "tags": ["happy", "productive"],
    "accessible_in_chat": true,
    "entry_date": "2025-09-01T00:00:00.000Z",
    "created_at": "2025-09-01T10:00:00.000Z"
  }
}
```

---

### 2. Get Journal Entries

**GET** `/journal?page=1&limit=10&mood_min=5&mood_max=10&tag=happy&from_date=2025-08-01&to_date=2025-09-01`
_Requires Authentication_

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `mood_min` (optional): Minimum mood score filter
- `mood_max` (optional): Maximum mood score filter
- `tag` (optional): Filter by tag
- `from_date` (optional): Start date filter (YYYY-MM-DD)
- `to_date` (optional): End date filter (YYYY-MM-DD)

**Response:**

```json
{
  "entries": [
    {
      "entry_id": "uuid-here",
      "user_id": "user-uuid",
      "title": "My Day",
      "content": "Today was a good day...",
      "mood_score": 8,
      "tags": ["happy", "productive"],
      "accessible_in_chat": true,
      "entry_date": "2025-09-01T00:00:00.000Z",
      "created_at": "2025-09-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_entries": 25,
    "has_next": true,
    "has_prev": false
  }
}
```

---

### 3. Get Single Journal Entry

**GET** `/journal/{entryId}`
_Requires Authentication_

**Response:**

```json
{
  "entry": {
    "entry_id": "uuid-here",
    "user_id": "user-uuid",
    "title": "My Day",
    "content": "Today was a good day...",
    "mood_score": 8,
    "tags": ["happy", "productive"],
    "accessible_in_chat": true,
    "entry_date": "2025-09-01T00:00:00.000Z",
    "created_at": "2025-09-01T10:00:00.000Z"
  }
}
```

---

### 4. Update Journal Entry

**PUT** `/journal/{entryId}`
_Requires Authentication_

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "mood_score": 9,
  "tags": ["amazing", "grateful"],
  "accessible_in_chat": false
}
```

**Response:**

```json
{
  "message": "Journal entry updated successfully",
  "entry": {
    "entry_id": "uuid-here",
    "user_id": "user-uuid",
    "title": "Updated Title",
    "content": "Updated content...",
    "mood_score": 9,
    "tags": ["amazing", "grateful"],
    "accessible_in_chat": false,
    "entry_date": "2025-09-01T00:00:00.000Z",
    "created_at": "2025-09-01T10:00:00.000Z"
  }
}
```

---

### 5. Delete Journal Entry

**DELETE** `/journal/{entryId}`
_Requires Authentication_

**Response:**

```json
{
  "message": "Journal entry deleted successfully"
}
```

---

### 6. Get Mood Statistics from Journal

**GET** `/journal/mood-stats?days=30`
_Requires Authentication_

**Query Parameters:**

- `days` (optional): Number of days to analyze (default: 30)

**Response:**

```json
{
  "period_days": 30,
  "average_mood": 7.5,
  "min_mood": 3,
  "max_mood": 10,
  "entries_count": 15,
  "mood_entries": [
    {
      "date": "2025-08-15T00:00:00.000Z",
      "mood": 8
    },
    {
      "date": "2025-08-16T00:00:00.000Z",
      "mood": 6
    }
  ]
}
```

---

## 😊 Mood Tracking Endpoints

### 1. Set Daily Mood

**POST** `/mood`
_Requires Authentication_

**Request Body:**

```json
{
  "mood_score": 8,
  "energy_level": 7,
  "anxiety_level": 3,
  "sleep_quality": 9,
  "notes": "Had a great day at work",
  "activities": ["exercise", "meditation", "socializing"],
  "date": "2025-09-01"
}
```

**Response:**

```json
{
  "message": "Mood updated successfully",
  "mood_entry": {
    "user_id": "user-uuid",
    "date": "2025-09-01T00:00:00.000Z",
    "mood_score": 8,
    "energy_level": 7,
    "anxiety_level": 3,
    "sleep_quality": 9,
    "notes": "Had a great day at work",
    "activities": ["exercise", "meditation", "socializing"],
    "created_at": "2025-09-01T10:00:00.000Z",
    "updated_at": "2025-09-01T10:00:00.000Z"
  }
}
```

---

### 2. Get Mood Entries

**GET** `/mood?from_date=2025-08-01&to_date=2025-09-01&days=30&page=1&limit=50`
_Requires Authentication_

**Query Parameters:**

- `from_date` (optional): Start date (YYYY-MM-DD)
- `to_date` (optional): End date (YYYY-MM-DD)
- `days` (optional): Number of days back from today (default: 30)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**

```json
{
  "mood_entries": [
    {
      "user_id": "user-uuid",
      "date": "2025-09-01T00:00:00.000Z",
      "mood_score": 8,
      "energy_level": 7,
      "anxiety_level": 3,
      "sleep_quality": 9,
      "notes": "Had a great day at work",
      "activities": ["exercise", "meditation", "socializing"],
      "created_at": "2025-09-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_entries": 15,
    "has_next": false,
    "has_prev": false
  }
}
```

---

### 3. Get Today's Mood

**GET** `/mood/today`
_Requires Authentication_

**Response:**

```json
{
  "date": "2025-09-01T00:00:00.000Z",
  "mood_entry": {
    "user_id": "user-uuid",
    "date": "2025-09-01T00:00:00.000Z",
    "mood_score": 8,
    "energy_level": 7,
    "anxiety_level": 3,
    "sleep_quality": 9,
    "notes": "Had a great day at work",
    "activities": ["exercise", "meditation", "socializing"],
    "created_at": "2025-09-01T10:00:00.000Z"
  },
  "has_entry": true
}
```

---

### 4. Get Mood Insights

**GET** `/mood/insights?days=30`
_Requires Authentication_

**Query Parameters:**

- `days` (optional): Number of days to analyze (default: 30)

**Response:**

```json
{
  "period_days": 30,
  "insights": {
    "average_mood": 7.2,
    "mood_range": {
      "min": 3,
      "max": 10
    },
    "average_energy": 6.8,
    "average_anxiety": 4.2,
    "average_sleep": 7.5,
    "entries_count": 25,
    "trend": "improving",
    "top_activities_on_good_days": [
      {
        "activity": "exercise",
        "count": 8
      },
      {
        "activity": "meditation",
        "count": 6
      }
    ],
    "consistency_score": 83
  }
}
```

---

### 5. Delete Mood Entry

**DELETE** `/mood/{date}`
_Requires Authentication_

**URL Parameters:**

- `date`: Date in YYYY-MM-DD format

**Response:**

```json
{
  "message": "Mood entry deleted successfully"
}
```

---

## 💬 Conversation/Chat with AI Endpoints

### 1. Get Available AI Types

**GET** `/conversations/ai-types`
_Requires Authentication_

**Response:**

```json
{
  "ai_types": [
    {
      "id": "supportive",
      "name": "Supportive AI",
      "description": "A caring and encouraging AI therapist"
    },
    {
      "id": "analytical",
      "name": "Analytical AI",
      "description": "A logical and structured AI therapist"
    },
    {
      "id": "creative",
      "name": "Creative AI",
      "description": "A creative and expressive AI therapist"
    },
    {
      "id": "jung",
      "name": "Jungian AI",
      "description": "An AI based on Carl Jung's analytical psychology"
    },
    {
      "id": "cbt",
      "name": "CBT AI",
      "description": "An AI specializing in Cognitive Behavioral Therapy"
    }
  ]
}
```

---

### 2. Create New Conversation

**POST** `/conversations`
_Requires Authentication_

**Request Body:**

```json
{
  "ai_type": "supportive",
  "title": "Chat about my anxiety",
  "journal_access_enabled": true
}
```

**Response:**

```json
{
  "message": "Conversation created successfully",
  "conversation": {
    "conversation_id": "uuid-here",
    "user_id": "user-uuid",
    "title": "Chat about my anxiety",
    "type": "therapy",
    "journal_access_enabled": true,
    "created_at": "2025-09-01T10:00:00.000Z",
    "last_message_at": "2025-09-01T10:00:00.000Z",
    "ai_type": "supportive",
    "ai_info": {
      "name": "Supportive AI",
      "description": "A caring and encouraging AI therapist"
    }
  },
  "initial_message": {
    "message_id": "uuid-here",
    "conversation_id": "conv-uuid",
    "user_id": "user-uuid",
    "sender": "ai",
    "content": "Hello! I'm your Supportive AI. A caring and encouraging AI therapist. How are you feeling today?",
    "created_at": "2025-09-01T10:00:00.000Z"
  }
}
```

---

### 3. Get All Conversations

**GET** `/conversations?page=1&limit=10`
_Requires Authentication_

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "conversations": [
    {
      "conversation_id": "uuid-here",
      "user_id": "user-uuid",
      "title": "Chat about my anxiety",
      "type": "therapy",
      "journal_access_enabled": true,
      "created_at": "2025-09-01T10:00:00.000Z",
      "last_message_at": "2025-09-01T12:00:00.000Z",
      "last_message": {
        "message_id": "uuid-here",
        "sender": "ai",
        "content": "I understand. Can you tell me more about that?",
        "created_at": "2025-09-01T12:00:00.000Z"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 2,
    "total_conversations": 15,
    "has_next": true,
    "has_prev": false
  }
}
```

---

### 4. Get Single Conversation with Messages

**GET** `/conversations/{conversationId}?page=1&limit=50`
_Requires Authentication_

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**

```json
{
  "conversation": {
    "conversation_id": "uuid-here",
    "user_id": "user-uuid",
    "title": "Chat about my anxiety",
    "type": "therapy",
    "journal_access_enabled": true,
    "created_at": "2025-09-01T10:00:00.000Z",
    "last_message_at": "2025-09-01T12:00:00.000Z"
  },
  "messages": [
    {
      "message_id": "uuid-here",
      "conversation_id": "conv-uuid",
      "user_id": "user-uuid",
      "sender": "ai",
      "content": "Hello! How are you feeling today?",
      "referenced_journal_entries": [],
      "created_at": "2025-09-01T10:00:00.000Z"
    },
    {
      "message_id": "uuid-here",
      "conversation_id": "conv-uuid",
      "user_id": "user-uuid",
      "sender": "user",
      "content": "I'm feeling anxious about work",
      "created_at": "2025-09-01T10:05:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_messages": 2,
    "has_next": false,
    "has_prev": false
  }
}
```

---

### 5. Send Message in Conversation (Immediate Response)

**POST** `/conversations/{conversationId}/messages`
_Requires Authentication_

**Request Body:**

```json
{
  "content": "I'm feeling really anxious about my upcoming presentation at work."
}
```

**Response (Immediate - User message saved, AI response generated in background):**

```json
{
  "message": "User message sent successfully",
  "user_message": {
    "message_id": "uuid-here",
    "conversation_id": "conv-uuid",
    "user_id": "user-uuid",
    "sender": "user",
    "content": "I'm feeling really anxious about my upcoming presentation at work.",
    "created_at": "2025-09-01T10:05:00.000Z"
  },
  "ai_message_id": "ai-uuid-here",
  "streaming": true
}
```

**Note:** This endpoint saves the user message immediately and returns. The AI response is generated in the background. Use the streaming endpoint below for real-time AI responses.

---

### 5b. Stream AI Response (Real-time like ChatGPT)

**POST** `/conversations/{conversationId}/stream`
_Requires Authentication_
_Returns Server-Sent Events (SSE)_

**Request Body:**

```json
{
  "message": "I'm feeling really anxious about my upcoming presentation at work."
}
```

**Response (Server-Sent Events Stream):**

```javascript
// Event 1 - Stream start
data: {
  "type": "start",
  "message_id": "ai-uuid-here",
  "timestamp": "2025-09-01T10:05:00.000Z"
}

// Event 2+ - Content chunks (multiple events as AI types)
data: {
  "type": "chunk",
  "message_id": "ai-uuid-here",
  "content": "I hear that you're feeling",
  "accumulated_content": "I hear that you're feeling"
}

data: {
  "type": "chunk",
  "message_id": "ai-uuid-here",
  "content": " anxious about your presentation.",
  "accumulated_content": "I hear that you're feeling anxious about your presentation."
}

// Final event - Stream complete
data: {
  "type": "complete",
  "message_id": "ai-uuid-here",
  "final_content": "I hear that you're feeling anxious about your presentation. Those feelings are valid and very common before important presentations. Can you tell me more about what specifically worries you about it?",
  "saved": true
}
```

**Frontend Usage Example:**

```javascript
const eventSource = new EventSource("/api/conversations/conv-id/stream", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Hello" }),
});

eventSource.onmessage = function (event) {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case "start":
      // Initialize AI message in UI
      break;
    case "chunk":
      // Update AI message content in real-time
      updateMessageContent(data.message_id, data.accumulated_content);
      break;
    case "complete":
      // Finalize message
      finalizeMessage(data.message_id, data.final_content);
      eventSource.close();
      break;
    case "error":
      // Handle error
      console.error("Streaming error:", data.error);
      eventSource.close();
      break;
  }
};
```

---

### 6. Cancel Stream

**DELETE** `/conversations/{conversationId}/stream`
_Requires Authentication_

**Description:** Cancel an active streaming response for a specific conversation.

**Response:**

```json
{
  "message": "Stream cancelled successfully",
  "message_id": "ai-message-uuid-here"
}
```

**Error Responses:**

```json
{
  "message": "No active stream found for this conversation"
}
```

**cURL Example:**

```bash
curl -X DELETE http://localhost:5003/api/conversations/your-conversation-id/stream \
  -b cookies.txt
```
```

---

### 7. Get Active Streams

**GET** `/conversations/streams/active`
_Requires Authentication_

**Description:** Get information about currently active streaming sessions for the authenticated user.

**⚠️ Important:** This endpoint must be accessed before any conversation-specific routes due to Express router matching order.

**Response:**

```json
{
  "active_streams": [
    {
      "conversation_id": "conv-uuid-here",
      "message_id": "msg-uuid-here",
      "start_time": "2025-09-01T17:30:00.000Z",
      "duration_ms": 5432
    }
  ],
  "total_active": 1
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5003/api/conversations/streams/active \
  -b cookies.txt
```
```

---

### 8. Delete Conversation

**DELETE** `/conversations/{conversationId}`
_Requires Authentication_

**Response:**

```json
{
  "message": "Conversation deleted successfully"
}
```

---

## 📊 Additional Notes

### AI Response System

The AI response system is powered by **Google Gemini AI** with **real-time streaming** like ChatGPT:

**🚀 Real-time Features:**

- **Instant user message save**: User messages are saved immediately, no waiting
- **Streaming AI responses**: AI responses stream in real-time using Server-Sent Events (SSE)
- **Stream cancellation**: Users can cancel active streaming responses
- **Two endpoints available**:
  - `/messages` - Immediate response (AI generated in background)
  - `/stream` - Real-time streaming response (like ChatGPT)
- **Active stream monitoring**: Track and manage ongoing streaming sessions

**🤖 AI Capabilities:**

- **Real AI Integration**: Uses Google Gemini Pro model with streaming support
- **Multiple AI personalities**:
  - **Supportive AI**: Warm, encouraging, focused on emotional support
  - **Analytical AI**: Logical, structured, helps analyze thoughts and patterns
  - **Creative AI**: Uses metaphors, storytelling, and creative approaches
  - **Jungian AI**: Based on Carl Jung's analytical psychology and archetypes
  - **CBT AI**: Specializes in Cognitive Behavioral Therapy techniques
- **Context awareness**: AI can reference recent journal entries and conversation history
- **Crisis detection**: Automatically detects crisis language and provides appropriate resources
- **Therapeutic approach**: Responses follow mental health best practices with professional boundaries
- **Fallback system**: Graceful degradation if AI service is unavailable
- **Conversation memory**: Maintains context within conversations for coherent dialogue

**🔧 Technical Implementation:**

- **Server-Sent Events (SSE)** for real-time streaming
- **Background processing** for non-blocking user experience
- **Automatic message persistence** - all responses saved to database
- **Error handling** with graceful fallbacks
- **Crisis intervention** with immediate specialized responses
- **Stream cancellation** - Users can stop active streams
- **Route ordering** - Stream management routes positioned before conversation ID routes to prevent conflicts

**📱 Frontend Integration:**

- Use `EventSource` API for real-time streaming
- Messages appear character-by-character like ChatGPT
- Automatic reconnection and error handling
- Works with any frontend framework (React, Vue, vanilla JS)

**Setup Requirements:**

- Obtain Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Add `GEMINI_API_KEY=your-api-key` to your `.env` file
- System automatically falls back to predefined responses if API key is missing

### Mood Tracking Features

- **Daily tracking**: One mood entry per day with multiple metrics
- **Rich insights**: Trends, patterns, and activity correlations
- **Flexibility**: Track mood, energy, anxiety, sleep quality
- **Activity correlation**: See which activities correlate with better moods

### Journal Integration

- **AI accessibility**: Choose which entries AI can reference
- **Mood correlation**: Link journal entries with mood scores
- **Rich filtering**: Search by mood, tags, dates
- **Privacy controls**: Control what information is shared with AI

---

## �📝 Notes for Postman

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
