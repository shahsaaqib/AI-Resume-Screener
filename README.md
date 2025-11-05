# 🧠 AI Resume Screener (Full Stack App)

An end-to-end **AI-powered Resume Analysis System** that allows users to upload PDF resumes, extracts and parses text, and intelligently analyzes candidate profiles using OpenAI / OpenRouter APIs.
Built with a **Fastify + Prisma + PostgreSQL** backend and a **React + Tailwind CSS (Vite)** frontend.

---

## 🚀 Overview

This project demonstrates a **production-grade full-stack architecture** with:

* Secure file uploads
* Real-time AI analysis of resumes
* Structured JSON extraction
* Status tracking for each resume
* A modern, responsive React dashboard

It’s designed for **scalability, clarity, and clean separation of concerns** between backend (API + DB) and frontend (UI + logic).

---

## 🧩 Tech Stack

### 🖥️ Frontend

* **React 19** + **TypeScript**
* **Tailwind CSS v4 (Vite Plugin)**
* **Lucide React Icons**
* **Axios** (API integration)
* **React Router DOM**

### ⚙️ Backend

* **Fastify** (high-performance Node.js framework)
* **Prisma ORM** with PostgreSQL
* **OpenAI / OpenRouter API integration**
* **TypeScript**
* **Docker + Docker Compose**
* **Multer / Fastify-Multipart** (for PDF uploads)
* **PDF-lib / PDF-parse** (for text extraction)

---

## 🗂️ Project Structure

```
ai-resume-screener/
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── upload/         # File upload logic
│   │   │   ├── analyze/        # AI analysis endpoint
│   │   │   └── resume/         # Resume details + listing
│   │   ├── lib/prisma.ts       # Prisma client
│   │   └── server.ts           # Fastify app entry
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── ResumeCard.tsx
│   │   │   └── UploadResume.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── ResumeDetail.tsx
│   │   ├── api/client.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── index.css
│
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

---

## 🧠 Key Features

### ✅ Backend

* Upload & parse PDF resumes
* Extract text using `pdf-lib`
* AI-powered resume analysis (via OpenAI/OpenRouter)
* Automatic JSON structuring of AI output
* Prisma ORM with PostgreSQL
* Status updates: `uploaded → analyzed`
* Safe environment variable management via `.env`

### 🎨 Frontend

* Drag-and-drop PDF upload UI
* Real-time list of uploaded resumes
* AI “Analyze” button for each resume
* Score visualization bar (color-coded)
* Resume detail page with:

  * Name
  * Summary
  * Skills
  * Strengths & Weaknesses
  * Education
  * AI Score

---

## 🧩 Environment Setup

### 1️⃣ Clone Repository

```bash
git clone [https://github.com/YOUR_USERNAME/ai-resume-screener.git](https://github.com/shahsaaqib/AI-Resume-Screener.git)
cd ai-resume-screener
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` with your database & API key:

```
DATABASE_URL="postgresql://user:password@localhost:5432/ai_resume_db?schema=public"
OPENAI_API_KEY="your_openai_or_openrouter_key_here"
```

Run migrations:

```bash
npx prisma migrate dev --name init
npm run dev
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

App runs at **[http://localhost:5173](http://localhost:5173)**
Backend runs at **[http://localhost:3000](http://localhost:3000)**

---

## 🐳 Docker Setup (Optional)

```bash
docker compose up --build
```

This spins up:

* PostgreSQL

---

## 🧠 AI Analysis Output Example

```json
{
  "name": "Arjun Sharma",
  "top_skills": ["Node.js", "Go", "PostgreSQL", "AWS"],
  "years_of_experience": 7,
  "education_summary": {
    "degree": "B.Tech",
    "university": "IIT Delhi",
    "graduation_year": 2016
  },
  "strengths": ["System Design", "Database Optimization"],
  "weaknesses": ["Frontend exposure"],
  "overall_score": 85
}
```

---

## 🎯 Future Enhancements

* User authentication (JWT / OAuth)
* Resume ranking engine
* PDF preview inside dashboard
* Cloud file storage (AWS S3 / Cloudflare R2)
* Job recommendation based on resume content

---

## 👨‍💻 Author

**Saaqib Ashraf**
Backend Developer | Node.js | PostgreSQL | AI Integrations
[LinkedIn](https://www.linkedin.com/in/saaqibashraf/) • [GitHub](https://github.com/shahsaaqib)

---

## 🛡️ License

MIT License © 2025 Saaqib Ashraf
Feel free to fork, use, or contribute.
