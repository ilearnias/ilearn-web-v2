import type { SiteSetting } from '@shared/schema';
import { apiRequest } from './queryClient';

// Site Settings
export async function getSiteSettings(): Promise<SiteSetting[]> {
  return apiRequest<SiteSetting[]>('/api/settings');
}

export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  try {
    return await apiRequest<SiteSetting>(`/api/settings/${key}`);
  } catch (error) {
    // Return null if setting not found or other error occurs
    console.log(`Error fetching setting ${key}:`, error);
    return null;
  }
}

export async function updateSiteSetting(key: string, value: string): Promise<SiteSetting> {
  return apiRequest<SiteSetting>(`/api/settings/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });
}

export async function createSiteSetting(key: string, value: string): Promise<SiteSetting> {
  return apiRequest<SiteSetting>('/api/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key, value }),
  });
}

// Constants for site settings keys
export const SITE_SETTINGS = {
  HERO_VIDEO_URL: 'hero_video_url',
  HERO_VIDEO_POSTER: 'hero_video_poster',
};