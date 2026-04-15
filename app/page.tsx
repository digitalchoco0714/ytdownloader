'use client';

import { useState } from 'react';
import { fetchVideoInfo, downloadVideo, VideoInfo } from '@/lib/api';
import VideoPreview from '@/components/VideoPreview';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState('');

  const handleFetchInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const info = await fetchVideoInfo(url);
      setVideoInfo(info);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch video information. Please check the URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo || !url) return;

    setIsDownloading(true);
    setError('');

    try {
      await downloadVideo(url, videoInfo.title);
    } catch (err: any) {
      setError('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          YouTube <span className="text-red-600">Downloader</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Fast and free YouTube to MP4 converter.
        </p>
      </div>

      <form onSubmit={handleFetchInfo} className="w-full max-w-2xl flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube video URL here..."
          className="flex-grow px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm text-gray-700"
          disabled={isLoading || isDownloading}
        />
        <button
          type="submit"
          disabled={isLoading || isDownloading || !url}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
        >
          {isLoading ? 'Fetching...' : 'Get Video'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl max-w-2xl w-full text-center animate-pulse">
          {error}
        </div>
      )}

      {videoInfo && (
        <VideoPreview 
          info={videoInfo} 
          onDownload={handleDownload} 
          isDownloading={isDownloading} 
        />
      )}

      <footer className="mt-20 text-gray-400 text-sm">
        Built with Next.js & FastAPI
      </footer>
    </main>
  );
}
