import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  description: string;
}

export const fetchVideoInfo = async (url: string): Promise<VideoInfo> => {
  const response = await axios.post(`${API_BASE_URL}/info`, { url });
  return response.data;
};

export const downloadVideo = async (url: string, title: string) => {
  const response = await axios.post(`${API_BASE_URL}/download`, { url });
  const { downloadUrl } = response.data;
  
  // The downloadUrl is relative to the backend base URL
  const fullUrl = `${API_BASE_URL}${downloadUrl}`;
  
  const link = document.createElement('a');
  link.href = fullUrl;
  link.setAttribute('download', `${title}.mp4`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
