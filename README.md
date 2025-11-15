# AI Interview Bot - Full Stack Application

A complete production-ready full-stack MVC web application for AI-powered interviews, featuring speech-to-text transcription (Whisper) and AI evaluation (Gemini).

## Project Structure

```
bot_interview/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   ├── controllers/ # Request handlers
│   │   └── routes/      # API endpoints
│   ├── requirements.txt
│   ├── .env.example
│   └── database_schema.sql
├── frontend/        # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
└── README.md
```

## Features

- **Admin Dashboard**: Create interviews, add questions, view candidate reports
- **Candidate Interface**: Take interviews with automatic recording and evaluation
- **AI Integration**: 
  - Whisper API for speech-to-text transcription
  - Gemini API for answer evaluation (score 1-10 with feedback)
- **Automatic Flow**: 30-second reading timer, 60-second auto-recording, automatic evaluation
- **JWT Authentication**: Secure admin and candidate authentication
- **Shareable Links**: Unique links for each interview with password protection

## Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 12+
- OpenAI API key (for Whisper)
- Google Gemini API key

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup PostgreSQL Database

1. Create a PostgreSQL database:
```sql
CREATE DATABASE interview_db;
```

2. Run the schema script:
```bash
psql -U your_username -d interview_db -f database_schema.sql
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/interview_db
JWT_SECRET=your-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
WHISPER_API_KEY=your-whisper-api-key
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGINS=http://localhost:5173
```

### 4. Run Backend Server

```bash
cd backend
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Admin Endpoints

- `POST /admin/login` - Admin login
- `POST /admin/create-interview` - Create interview
- `POST /admin/add-question` - Add question to interview
- `GET /admin/interviews` - List all interviews
- `GET /admin/interview/{id}/dashboard` - Interview dashboard
- `GET /admin/interview/{id}/candidates` - List candidates
- `GET /admin/report/{candidateId}` - Candidate report

### Candidate Endpoints

- `GET /interview/{linkId}` - Get interview by link (public)
- `POST /candidate/register` - Register candidate
- `POST /candidate/start` - Start interview
- `POST /candidate/save-answer` - Save answer

### AI Endpoints

- `POST /ai/transcribe` - Transcribe audio (Whisper)
- `POST /ai/evaluate` - Evaluate transcript (Gemini)

## Usage

### Creating an Interview (Admin)

1. Login at `/admin/login`
2. Click "Create New Interview"
3. Enter title, description, and questions
4. Copy the shareable link and candidate password
5. Share with candidates

### Taking an Interview (Candidate)

1. Access interview via shareable link
2. Register with name, email, and interview password
3. Read question (30 seconds)
4. Answer is automatically recorded (60 seconds)
5. Answer is transcribed and evaluated automatically
6. Results are shown and interview progresses to next question

## Database Schema

- **admins**: Admin users
- **interviews**: Interview details
- **questions**: Interview questions
- **candidates**: Candidate information
- **answers**: Candidate answers with scores and feedback
- **candidate_auth**: Candidate authentication
- **interview_links**: Shareable interview links

## Security Notes

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Database sessions are managed via dependency injection
- CORS is configured for development

## Development Notes

- Backend uses FastAPI with strict MVC architecture
- Frontend uses React with Vite
- All routes use dependency injection for database and authentication
- Auto-progress logic handles question flow automatically
- Email sending is simulated (logs to console)

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists and schema is applied

### API Key Issues

- Verify WHISPER_API_KEY and GEMINI_API_KEY are set
- Check API key permissions and quotas

### CORS Issues

- Ensure CORS_ORIGINS matches frontend URL
- Check browser console for CORS errors

## License

This project is provided as-is for educational and development purposes.

