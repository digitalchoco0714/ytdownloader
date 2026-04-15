import React from 'react';
import { VideoInfo } from '@/lib/api';

interface VideoPreviewProps {
  info: VideoInfo;
  onDownload: () => void;
  isDownloading: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ info, onDownload, isDownloading }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100 max-w-2xl w-full">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-shrink-0">
          <img 
            src={info.thumbnail} 
            alt={info.title} 
            className="w-full md:w-64 aspect-video object-cover rounded-lg shadow-sm"
          />
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(info.duration)}
          </span>
        </div>
        
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{info.title}</h3>
            <p className="text-sm text-gray-600 mt-1 font-medium">{info.uploader}</p>
            <p className="text-sm text-gray-500 mt-3 line-clamp-3 leading-relaxed">
              {info.description}
            </p>
          </div>
          
          <button
            onClick={onDownload}
            disabled={isDownloading}
            className={`mt-6 w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-200 
              ${isDownloading 
                ? 'bg-gray-400 cursor-not-allowed scale-[0.98]' 
                : 'bg-red-600 hover:bg-red-700 active:scale-95 shadow-md hover:shadow-lg'}`}
          >
            {isDownloading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </span>
            ) : 'Download MP4'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
