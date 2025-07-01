# AI Story Builder Backend

A robust Express.js backend for the AI Story Builder application with OpenAI integration, user authentication, and story management.

## 🚀 Features

- **OpenAI Integration**: GPT-4 for story generation and DALL-E 3 for image creation
- **User Authentication**: JWT-based auth with bcrypt password hashing
- **Story Management**: Complete CRUD operations for interactive stories
- **Rate Limiting**: Built-in protection against API abuse
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, and input validation
- **Token Management**: Usage tracking and subscription limits

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 4.4+
- OpenAI API key
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 10-generative-ai-story-builder/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/ai-story-builder
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Client
   CLIENT_URL=http://localhost:5173
   
   # OpenAI API
   OPENAI_API_KEY=your-openai-api-key-here
   
   # DALL-E Configuration
   ENABLE_IMAGE_GENERATION=true
   MAX_TOKENS=1000
   TEMPERATURE=0.7
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### AI Operations
- `GET /api/ai/status` - Check AI service availability
- `POST /api/ai/generate-story` - Generate initial story content
- `POST /api/ai/continue-story` - Continue story based on choice
- `POST /api/ai/generate-choices` - Generate story choices
- `POST /api/ai/generate-image` - Generate story image
- `GET /api/ai/usage` - Get user's AI usage statistics

### Stories
- `GET /api/stories` - Get user's stories
- `POST /api/stories` - Create new story
- `GET /api/stories/public` - Get public stories (gallery)
- `GET /api/stories/:id` - Get specific story
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story
- `POST /api/stories/:id/segments` - Add story segment
- `POST /api/stories/:id/choices/:choiceId` - Make story choice
- `GET /api/stories/:id/tree` - Get story tree structure

### Users
- `GET /api/users/:username` - Get user public profile
- `GET /api/users/:username/stories` - Get user's public stories
- `GET /api/users` - Search users
- `GET /api/users/stats/leaderboard` - Get user leaderboard

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── middleware/
│   │   ├── auth.js          # Authentication middleware
│   │   └── errorHandler.js  # Error handling middleware
│   ├── models/
│   │   ├── User.js          # User model with auth & subscriptions
│   │   └── Story.js         # Story model with segments & choices
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── ai.js            # OpenAI integration routes
│   │   ├── stories.js       # Story management routes
│   │   └── users.js         # User profile routes
│   ├── utils/
│   │   └── openai.js        # OpenAI service functions
│   └── server.js            # Main server file
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── nodemon.json            # Nodemon configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔐 Security Features

- **Helmet**: Security headers protection
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: API request throttling
- **Input Validation**: Express-validator for request validation
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage

## 🎯 Usage Examples

### Generate a Story
```bash
curl -X POST http://localhost:5000/api/ai/generate-story \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A space explorer discovers an ancient alien artifact",
    "genre": "sci-fi",
    "tone": "dramatic",
    "model": "gpt-3.5-turbo"
  }'
```

### Create a Story
```bash
curl -X POST http://localhost:5000/api/stories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Cosmic Discovery",
    "description": "An epic space adventure",
    "initialPrompt": "A space explorer discovers an ancient alien artifact",
    "genre": "sci-fi",
    "tone": "dramatic"
  }'
```

## 📊 Rate Limits

- **General API**: 100 requests per 15 minutes per IP
- **AI Endpoints**: 10 requests per minute per IP
- **Token Limits**: 
  - Free tier: 10,000 tokens/month
  - Premium: Higher limits
  - Pro: Unlimited

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 🔄 Development

### Running in Development Mode
```bash
npm run dev
```

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 📦 Deployment

1. **Set environment to production**
   ```env
   NODE_ENV=production
   ```

2. **Configure production database**
   ```env
   MONGODB_URI=mongodb://your-production-mongodb-uri
   ```

3. **Set secure JWT secret**
   ```env
   JWT_SECRET=your-very-secure-production-secret
   ```

4. **Deploy using your preferred method**
   - PM2
   - Docker
   - Heroku
   - Railway
   - Render

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error logs and environment details

## 🔮 Future Enhancements

- [ ] Real-time collaboration
- [ ] Story templates
- [ ] Advanced AI models
- [ ] Social features (following, comments)
- [ ] Story analytics
- [ ] Export functionality
- [ ] Multi-language support 