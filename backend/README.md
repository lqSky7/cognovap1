# Cognova P1 Backend Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your actual configuration values:

#### Required Environment Variables:

**MongoDB Atlas:**

- `MONGODB_URI`: Your MongoDB Atlas connection string

**JWT Security:**

- `JWT_SECRET`: A strong random string for JWT token signing

**Google Gemini AI (for chat functionality):**

- `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)

**Firebase (for Google Sign-in):**

- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, etc.: Firebase service account credentials

**Admin Configuration:**

- `ADMIN_EMAILS`: Comma-separated list of admin email addresses

### 3. Start the Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will start on port 5003 (or your configured PORT).

## 🤖 AI Integration Setup

### Google Gemini Configuration

1. **Get API Key:**

   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key to your `.env` file as `GEMINI_API_KEY`

2. **Features Enabled:**

   - Intelligent, contextual AI responses
   - Multiple therapeutic AI personalities
   - Journal entry integration
   - Crisis detection and response
   - Conversation memory and context

3. **Fallback Behavior:**
   - If API key is missing or invalid, system uses predefined responses
   - No functionality is lost, just less intelligent responses
   - Error logging helps debug API issues

## 📋 API Features

### Core Functionality:

- ✅ **User Authentication** (JWT with HTTP-only cookies)
- ✅ **Journal Entries** (CRUD with mood tracking)
- ✅ **Mood Tracking** (Daily metrics with insights)
- ✅ **AI Conversations** (Multiple AI personalities)
- ✅ **Crisis Detection** (Safety features)
- ✅ **Admin Panel** (User management)

### AI Personalities Available:

- **Supportive AI**: Warm, encouraging emotional support
- **Analytical AI**: Logical analysis and pattern recognition
- **Creative AI**: Metaphorical and expressive therapy
- **Jungian AI**: Archetypal and unconscious exploration
- **CBT AI**: Cognitive behavioral therapy techniques

## 🔧 Development

### Project Structure:

```
backend/
├── controllers/     # Request handlers
├── middleware/      # Authentication & validation
├── models/         # MongoDB schemas
├── routes/         # API endpoints
├── services/       # External service integrations
├── scripts/        # Utility scripts
└── server.js       # Main application entry
```

### Testing the APIs:

1. Use the provided `API_DOCUMENTATION.md` for endpoint details
2. Import the Postman collection (if available)
3. Enable cookie support in your HTTP client
4. Start with authentication endpoints

### Database:

- Uses MongoDB Atlas with Mongoose ODM
- Automatic schema validation and indexing
- Supports both local and cloud MongoDB instances

## 🛡️ Security Features

- **JWT Authentication** with HTTP-only cookies
- **Password hashing** with bcrypt
- **Input validation** and sanitization
- **CORS protection** with configurable origins
- **Crisis detection** for mental health safety
- **Admin role separation** for user management

## 📱 Integration Ready

The backend is designed to work with:

- React/React Native frontends
- Mobile applications
- Web applications
- Third-party integrations

All endpoints return consistent JSON responses with proper HTTP status codes and error handling.

## 🚨 Important Notes

1. **Mental Health Considerations:**

   - Crisis detection is implemented but should not replace professional help
   - AI responses are supportive but not a substitute for therapy
   - Consider legal compliance for health data in your jurisdiction

2. **API Keys Security:**

   - Never commit real API keys to version control
   - Use environment variables for all sensitive data
   - Rotate keys regularly in production

3. **Production Deployment:**
   - Set `NODE_ENV=production`
   - Use proper MongoDB Atlas security settings
   - Configure CORS for your frontend domain
   - Set up proper logging and monitoring

## 📞 Support

For issues or questions:

1. Check the API documentation
2. Review error logs in the console
3. Verify environment variable configuration
4. Test with provided example requests
