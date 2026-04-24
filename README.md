# Raven: AI-Powered Anonymous Social Platform

> Speak freely. Connect securely. Powered by AI.

Raven is a full-stack anonymous messaging platform designed to make honest conversations safe, intelligent, and frictionless.

It blends privacy-first communication with real-time generative AI, allowing users to receive anonymous messages through a unique link while helping senders overcome the "what do I say?" problem with smart, context-aware suggestions.

Built with scalability, security, and performance in mind, Raven is a production-ready system exploring the future of AI-assisted social interaction.

## Features

### AI-Streaming Suggestion Engine
- Powered by Google Gemini
- Integrated via Vercel AI SDK
- Real-time streaming suggestions with low latency
- Runs on Next.js Edge Runtime for global responsiveness

### Secure Authentication
- JWT-based authentication with NextAuth.js
- OTP-based email verification flow
- Email delivery with Resend + React Email
- Password hashing with bcryptjs

### Privacy Controls
- Fully anonymous message handling
- Toggle to accept/reject incoming messages
- Debounced username availability checks
- Dashboard for message management

### Modern UI/UX
- Next.js 16 + React 19
- Tailwind CSS 4
- shadcn/ui + Radix UI
- Responsive, accessible interface

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui + Radix UI

### Backend and Database
- Next.js Route Handlers (REST APIs)
- MongoDB
- Mongoose
- Zod validation

### Authentication and AI
- NextAuth.js (JWT strategy)
- bcryptjs
- Vercel AI SDK
- @google/genai (Gemini API)
- Resend API

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/SiddhanthChauhan/Raven.git
cd Raven
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the project root:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_super_secret_string
NEXTAUTH_URL=http://localhost:3000

# Resend API (email OTP)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev

# Google Gemini AI
GOOGLE_API_KEY=your_gemini_api_key
```

### 4. Run the development server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Architectural Decisions

### Edge Runtime for AI
The AI suggestion route runs on the Next.js Edge Runtime instead of Node.js:
- Faster cold starts
- Lower-latency global streaming
- Better real-time UX for generated suggestions

### JWT over Database Sessions
- Sessions are managed using JSON Web Tokens
- Reduces database read/write overhead
- Improves scalability for high-traffic usage

## Project Highlights
- Real-time AI streaming UX
- Secure anonymous communication flow
- Production-ready full-stack architecture
- Clean, modular, scalable codebase

## Author
Siddhanth Chauhan