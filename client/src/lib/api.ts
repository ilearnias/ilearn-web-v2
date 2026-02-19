import type { SiteSetting } from '@shared/schema';
import apiClient from '@/config/apiClient';
import { API } from '@/config/api';

// Site Settings
export async function getSiteSettings(): Promise<SiteSetting[]> {
  const response = await apiClient.get(API.SITE_SETTINGS);
  return response.data?.data || response.data || [];
}

export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  try {
    const response = await apiClient.get(API.SITE_SETTINGS + '/' + key);
    return response.data?.data || response.data || null;
  } catch (error) {
    // Return null if setting not found or other error occurs
    console.log(`Error fetching setting ${key}:`, error);
    return null;
  }
}

export async function updateSiteSetting(key: string, value: string): Promise<SiteSetting> {
  const response = await apiClient.put(API.SITE_SETTINGS + '/' + key, { value });
  return response.data?.data || response.data;
}

export async function createSiteSetting(key: string, value: string): Promise<SiteSetting> {
  const response = await apiClient.put(API.SITE_SETTINGS + '/' + key, { value });
  return response.data?.data || response.data;
}

// Constants for site settings keys
export const SITE_SETTINGS = {
  HERO_VIDEO_URL: 'hero_video_url',
  HERO_VIDEO_POSTER: 'hero_video_poster',
};
