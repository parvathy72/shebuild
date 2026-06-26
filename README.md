# ReLaunchHer 🌸

A soft, safe space for women restarting their careers. Built with Firebase Authentication, Firestore Database, and OpenRouter AI.

## Features

- 🔐 Firebase Authentication (Signup/Login)
- 💾 Firebase Realtime Database for user data, jobs, mentors, and posts
- 🤖 OpenRouter AI Integration for:
  - Resume gap reframing
  - Interview practice feedback
  - Career roadmap generation
- 💼 Job Discovery
- 👩🏫 Mentorship Matching
- 💬 Peer Support Community

## Quick Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Enable **Realtime Database** (Start in test mode)
5. Go to Project Settings → Copy your Firebase config

### 3. OpenRouter API Setup

1. Sign up at [openrouter.ai](https://openrouter.ai/)
2. Get your API key
3. Add credits to your account

### 4. Environment Variables

Create `.env` file:

```env
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
```

### 5. Run the Application

Windows:
```bash
start.bat
```

Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

Or manually:
```bash
python server.py
```

Open: http://localhost:3000

## Project Structure

```
relaunchher/
├── config/
│   └── firebase.py          # Firebase configuration
├── routes/
│   ├── auth.py              # Authentication
│   ├── user.py              # User profiles
│   ├── jobs.py              # Job discovery
│   ├── mentors.py           # Mentorship
│   ├── peer.py              # Peer support
│   └── ai.py                # OpenRouter AI
├── static/
│   ├── api.js               # Frontend API client
│   └── fix.js               # Frontend logic
├── index.html               # Main frontend
├── server.py                # Flask server
├── requirements.txt         # Dependencies
└── .env                     # Your credentials
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-token` - Verify token

### User
- `GET /api/user/:uid` - Get profile
- `PUT /api/user/:uid` - Update profile
- `GET /api/user/:uid/progress` - Get progress

### Jobs
- `GET /api/jobs` - Get jobs (with filters)
- `POST /api/jobs` - Create job

### Mentors
- `GET /api/mentors` - Get mentors
- `POST /api/mentors` - Add mentor

### Peer Support
- `GET /api/peer/posts` - Get posts
- `POST /api/peer/posts` - Create post
- `POST /api/peer/report` - Report post

### AI Features
- `POST /api/ai/resume-gap` - Resume gap reframe
- `POST /api/ai/interview-feedback` - Interview feedback
- `POST /api/ai/career-roadmap` - Career roadmap

## Firebase Database Structure

```
{
  "users": {
    "uid": {
      "fullName": "...",
      "email": "...",
      "industry": "...",
      "readinessScore": 0,
      "confidenceScore": 0
    }
  },
  "jobs": {
    "job_id": {
      "title": "...",
      "company": "...",
      "mode": "remote",
      "type": "returnship"
    }
  },
  "mentors": {
    "mentor_id": {
      "name": "...",
      "title": "...",
      "industry": "..."
    }
  },
  "posts": {
    "post_id": {
      "content": "...",
      "userId": "...",
      "createdAt": "..."
    }
  }
}
```

## Deployment

### Heroku
```bash
heroku create relaunchher
heroku config:set FIREBASE_API_KEY=your_key
# ... set all variables
git push heroku main
```

### Railway
1. Connect GitHub repo
2. Add environment variables
3. Deploy

## Security

- ✅ `.env` in `.gitignore`
- ✅ Firebase security rules configured
- ✅ API keys kept secret

## License

MIT

---

Made with 💕 for women restarting their careers
