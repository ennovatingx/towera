import type { AudioRecording } from '@/types/studio';
import { request, uploadToPresignedUrl } from './client';

export interface AudioUploadSlot {
  uploadUrl: string;
  s3Key: string;
  contentType: string;
  translationId: number;
}

export interface UploadAudioMeta {
  durationSeconds?: number;
}

interface PresignResponse {
  upload_url: string;
  s3_key: string;
  content_type: string;
}

export async function requestAudioUploadSlot(
  translationId: number,
  meta: { fileName: string; contentType: string }
): Promise<AudioUploadSlot> {
  const res = await request<PresignResponse>('/api/audio/presign/', {
    method: 'POST',
    body: JSON.stringify({
      translation: translationId,
      filename: meta.fileName,
      content_type: meta.contentType,
    }),
  });
  return {
    uploadUrl: res.upload_url,
    s3Key: res.s3_key,
    contentType: res.content_type,
    translationId,
  };
}

export async function uploadAudioBlob(slot: AudioUploadSlot, blob: Blob, meta: UploadAudioMeta): Promise<AudioRecording> {
  await uploadToPresignedUrl(slot.uploadUrl, blob, slot.contentType);
  return request<AudioRecording>('/api/audio/', {
    method: 'POST',
    body: JSON.stringify({
      translation: slot.translationId,
      s3_key: slot.s3Key,
      content_type: slot.contentType,
      duration_seconds: meta.durationSeconds ?? null,
    }),
  });
}

export async function getAudioRecording(id: number): Promise<AudioRecording | null> {
  try {
    return await request<AudioRecording>(`/api/audio/${id}/`);
  } catch {
    return null;
  }
}
