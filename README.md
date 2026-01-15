# AI Email Writing Assistant

## 📧 Project Overview
AI Email Writing Assistant is a sophisticated web application that leverages Google's Gemini AI to help users compose, refine, and manage professional emails. This portfolio project demonstrates expertise in AI integration, user experience design, and full-stack development.

## ✨ Key Features

### ✍️ Smart Email Composition
- **AI-Powered Generation**: Create complete emails from simple prompts or bullet points
- **Tone Adjustment**: Switch between 8+ tones (Professional, Casual, Formal, Persuasive, Friendly, Apologetic, Urgent, Diplomatic)
- **Length Control**: Choose from Concise, Standard, or Detailed formats
- **Multi-language Support**: Compose emails in 20+ languages
- **Context-Aware Suggestions**: Intelligent subject lines, openings, and closings

### 🔧 Enhancement Tools
- **Grammar & Style Checker**: Real-time proofreading with suggestions
- **Tone Analyzer**: Detects and visualizes email sentiment
- **Clarity Improver**: Rewrites complex sentences for better understanding
- **Vocabulary Enhancer**: Suggests stronger word choices
- **Length Optimizer**: Makes emails more concise or detailed as needed

### 📁 Email Management
- **Template Library**: Save and organize email templates by category
- **Email History**: Access and reuse previous compositions
- **Contact Manager**: Store and autocomplete recipient information
- **Category System**: Organize by type (Work, Personal, Follow-up, etc.)
- **Response Generator**: Create replies based on received emails

### 🎯 Specialized Email Types
- **Job Applications**: With ATS optimization and keyword suggestions
- **Sales & Marketing**: CTAs, value propositions, and engagement tactics
- **Customer Service**: Empathetic, solution-focused responses
- **Meeting Requests**: Professional scheduling with calendar integration
- **Networking**: Introduction emails and follow-ups
- **Performance Reviews**: Constructive feedback delivery
- **Apology Letters**: Damage control and relationship repair

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Next.js 14** for server-side rendering and routing
- **Tailwind CSS** for utility-first styling
- **Tiptap** for rich text editing
- **React Hook Form** for form management
- **Zustand** for state management
- **Recharts** for data visualization
- **Framer Motion** for animations

### Backend
- **FastAPI** (Python) for high-performance API
- **Pydantic** for data validation
- **PostgreSQL** with Prisma ORM
- **Redis** for caching and real-time features
- **Celery** for background tasks
- **Google Gemini API** for AI capabilities

### DevOps & Tools
- **Docker** & Docker Compose
- **PostgreSQL** for production
- **Redis** for session management
- **NGINX** for reverse proxy
- **GitHub Actions** for CI/CD
- **Jest** & **Pytest** for testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Redis 7+
- Google Gemini API Key

### Local Development

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ai-email-assistant.git
cd ai-email-assistant
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings:
# GEMINI_API_KEY=your_key_here
# DATABASE_URL=postgresql://user:pass@localhost:5432/email_assistant

# Initialize database
prisma db push

# Start backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

#### 4. Start Additional Services
```bash
# Start Redis (required for real-time features)
docker run -d -p 6379:6379 redis

# Start Celery worker (optional, for background tasks)
cd backend
celery -A app.worker worker --loglevel=info
```

### Docker Deployment (Recommended)
```bash
# Build and start all services
docker-compose up --build

# Or in production mode
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Project Structure

```
ai-email-assistant/
├── frontend/
│   ├── app/                    # Next.js app router pages
│   │   ├── (dashboard)/       # Protected routes
│   │   ├── api/              # Frontend API routes
│   │   └── layout.tsx        # Root layout
│   ├── components/            # React components
│   │   ├── editor/           # Email editor components
│   │   ├── ai-suggestions/   # AI feature components
│   │   ├── templates/        # Template library
│   │   └── ui/              # Reusable UI components
│   ├── lib/                  # Utilities and hooks
│   ├── store/                # Zustand stores
│   └── styles/               # Global styles
├── backend/
│   ├── app/
│   │   ├── api/              # FastAPI endpoints
│   │   │   ├── v1/          # API versioning
│   │   │   │   ├── emails.py
│   │   │   │   ├── templates.py
│   │   │   │   └── analysis.py
│   │   ├── core/             # Configuration
│   │   ├── models/           # Database models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   │   ├── gemini_service.py
│   │   │   └── email_analyzer.py
│   │   ├── worker.py         # Celery worker
│   │   └── main.py           # FastAPI app
│   ├── prisma/               # Database schema
│   └── requirements.txt
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## ⚙️ Configuration

### Environment Variables

**Backend (.env):**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/email_assistant"

# AI Services
GEMINI_API_KEY="your_google_gemini_api_key"

# Redis
REDIS_URL="redis://localhost:6379"

# Security
SECRET_KEY="your_secret_key_here"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
DEBUG=False
ALLOWED_ORIGINS=["http://localhost:3000"]
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXT_PUBLIC_WS_URL="ws://localhost:8000/ws"
NEXT_PUBLIC_SENTRY_DSN="" # Optional for error tracking
```

## 🔧 API Reference

### Base URL
```
http://localhost:8000/api/v1
```

### Key Endpoints

#### Email Generation
```http
POST /emails/generate
Content-Type: application/json

{
  "recipient_type": "colleague",
  "purpose": "meeting_request",
  "key_points": ["Discuss Q3 results", "Schedule review"],
  "tone": "professional",
  "length": "concise"
}
```

#### Email Analysis
```http
POST /emails/analyze
Content-Type: application/json

{
  "email_text": "Your email content here",
  "analysis_type": "full" // grammar, tone, clarity, all
}
```

#### Template Management
```http
GET /templates
POST /templates
PUT /templates/{id}
DELETE /templates/{id}
```

#### Real-time Suggestions (WebSocket)
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (event) => {
  const suggestions = JSON.parse(event.data);
  // Update UI with real-time suggestions
};
```

## 🎯 Usage Examples

### 1. Generate a Professional Email
```javascript
// Example prompt to AI
{
  "recipient": "Potential Client",
  "relationship": "First Contact",
  "goal": "Schedule Discovery Call",
  "key_points": [
    "Introduce our AI solutions",
    "Share relevant case study",
    "Request 30-minute meeting"
  ],
  "tone": "Professional but Friendly",
  "urgency": "Medium"
}
```

### 2. Improve Existing Email
```javascript
// Before:
"Hey, I'm following up about the thing we talked about."

// AI Suggestions:
1. Tone: "Professional" → "Dear [Name], I'm following up regarding our discussion about [topic]."
2. Clarity: Add specific reference → "Following up on our conversation on [date] about [specific topic]."
3. Action: Add clear next step → "Could we schedule a brief call next week to move forward?"
```

### 3. Template Categories
- **Job Applications**: Cover letters, follow-ups, thank you notes
- **Sales Outreach**: Cold emails, follow-ups, proposal emails
- **Customer Service**: Complaint responses, apology emails, FAQ replies
- **Internal Communication**: Project updates, meeting minutes, status reports
- **Networking**: Connection requests, introduction emails, thank you messages

## 🚢 Deployment

### Vercel (Frontend)
```bash
# Deploy frontend
vercel --prod

# Set environment variables in Vercel dashboard
```

### Railway (Backend & Database)
```bash
# Deploy with Railway CLI
railway up
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy stack
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Environment Variables for Production
```env
# Production .env
DATABASE_URL="postgresql://prod_user:strong_password@production-db:5432/email_assistant_prod"
GEMINI_API_KEY="your_production_gemini_key"
REDIS_URL="redis://production-redis:6379"
SECRET_KEY="production_secret_key_change_this"
DEBUG=False
ALLOWED_ORIGINS=["https://yourapp.com"]
```

## 📊 Performance Optimizations

- **API Caching**: Redis caching for frequent requests
- **Chunk Processing**: Handle long emails in segments
- **Lazy Loading**: Load templates and history on demand
- **WebSocket**: Real-time suggestions without polling
- **CDN**: Static assets served via CDN
- **Database Indexing**: Optimized queries with Prisma

## 🔒 Security Features

- **API Key Encryption**: Environment-based key management
- **Input Sanitization**: Prevent XSS and injection attacks
- **Rate Limiting**: API endpoint protection
- **JWT Authentication**: Secure user sessions
- **CORS Configuration**: Strict origin policies
- **Content Security Policy**: Prevent malicious scripts

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest --cov=app tests/

# Frontend tests
cd frontend
npm test
npm run test:e2e  # End-to-end tests

# Run all tests with coverage
npm run test:coverage
```

**API Documentation**: [https://email-assistant.vercel.app/api/docs](https://email-assistant.vercel.app/api/docs)

*Built with ❤️ for the developer community. Replace placeholder URLs with your actual project links.*
