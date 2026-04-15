# YouTube Downloader

A modern YouTube to MP4 downloader web application built with Next.js and FastAPI.

## Features
- YouTube URL video info preview (Thumbnail, Title, Uploader, Duration)
- One-click MP4 download
- Responsive design with Tailwind CSS
- Asynchronous video processing with yt-dlp

## Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS, TypeScript
- **Backend:** Python FastAPI, yt-dlp

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.8+

### 1. Setup Backend
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*(Note: Backend runs on http://localhost:8000)*

### 2. Setup Frontend
```bash
# In the root directory
npm install
npm run dev
```
*(Note: Frontend runs on http://localhost:3000)*

## Deployment

### Frontend (Vercel)
1. Push to GitHub (Done)
2. Import the repository in Vercel dashboard.
3. Set `NEXT_PUBLIC_API_URL` environment variable to your backend URL.

### Backend
Deploy to a platform that supports Python (Render, Railway, Fly.io, or Vercel Serverless Functions).
*(Note: Ensure `yt-dlp` and `ffmpeg` are available in the deployment environment for full functionality.)*
