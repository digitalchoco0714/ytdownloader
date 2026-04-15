import os
import uuid
import yt_dlp
import tempfile
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use /tmp for serverless environments (like Vercel)
DOWNLOAD_DIR = os.path.join(tempfile.gettempdir(), "ytdownloader_downloads")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

class VideoRequest(BaseModel):
    url: str

class VideoInfo(BaseModel):
    title: str
    thumbnail: str
    duration: int
    uploader: str
    description: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "YouTube Downloader API is running"}

@app.post("/info", response_model=VideoInfo)
async def get_video_info(request: VideoRequest):
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.url, download=False)
            return {
                "title": info.get("title"),
                "thumbnail": info.get("thumbnail"),
                "duration": info.get("duration"),
                "uploader": info.get("uploader"),
                "description": info.get("description", "")[:200] + "..." if info.get("description") else ""
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

from fastapi.staticfiles import StaticFiles

# Create a static directory for downloads
STATIC_DOWNLOAD_DIR = os.path.join(tempfile.gettempdir(), "ytdownloader_static")
os.makedirs(STATIC_DOWNLOAD_DIR, exist_ok=True)

# Mount the static directory
app.mount("/static", StaticFiles(directory=STATIC_DOWNLOAD_DIR), name="static")

def cleanup_file(path: str):
    if os.path.exists(path):
        os.remove(path)

@app.post("/download")
async def download_video(request: VideoRequest, background_tasks: BackgroundTasks):
    file_id = str(uuid.uuid4())
    # Ensure it saves as mp4
    output_template = os.path.join(STATIC_DOWNLOAD_DIR, f"{file_id}.%(ext)s")
    
    ydl_opts = {
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'outtmpl': output_template,
        'quiet': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.url, download=True)
            filename = ydl.prepare_filename(info)
            
            # Find the actual file (extension might vary)
            actual_filename = filename
            extension = "mp4"
            if not os.path.exists(actual_filename):
                for f in os.listdir(STATIC_DOWNLOAD_DIR):
                    if f.startswith(file_id):
                        actual_filename = os.path.join(STATIC_DOWNLOAD_DIR, f)
                        extension = f.split(".")[-1]
                        break
            
            if not os.path.exists(actual_filename):
                raise HTTPException(status_code=500, detail="Download failed")

            # Return the URL
            download_url = f"/static/{os.path.basename(actual_filename)}"
            return {"downloadUrl": download_url, "title": info.get('title', 'video')}
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
