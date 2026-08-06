import { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import type { AudioSource } from '@/types/studio';

interface CaptureMeta {
  fileName?: string;
  durationSeconds?: number;
  mimeType: string;
}

interface AudioRecorderProps {
  onCapture: (blob: Blob, source: AudioSource, meta: CaptureMeta) => void;
  onTranscribe?: (transcript: string) => void;
  onClear?: () => void;
  existingAudioUrl?: string | null;
  recognitionLang?: string;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function AudioRecorder({
  onCapture,
  onTranscribe,
  onClear,
  existingAudioUrl,
  recognitionLang,
}: AudioRecorderProps) {
  const recorder = useAudioRecorder();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);

  useEffect(() => {
    if (recorder.status === 'recorded' && recorder.audioBlob && recorder.audioUrl) {
      onCapture(recorder.audioBlob, 'recorded', {
        durationSeconds: recorder.durationSeconds,
        mimeType: recorder.mimeType ?? 'audio/webm',
      });
    }
  }, [recorder.status, recorder.audioBlob, recorder.audioUrl, recorder.durationSeconds, recorder.mimeType, onCapture]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedUrl(URL.createObjectURL(file));
    setUploadedName(file.name);
    onCapture(file, 'uploaded', { fileName: file.name, mimeType: file.type || 'audio/mpeg' });
  };

  const handleReRecord = () => {
    recorder.reset();
    setUploadedUrl(null);
    setUploadedName(null);
    onClear?.();
  };

  const previewUrl = recorder.audioUrl ?? uploadedUrl ?? existingAudioUrl ?? null;
  const showPreview = Boolean(previewUrl) && recorder.status !== 'recording';
  const canTranscribe = recorder.status === 'recorded' && Boolean(recorder.transcript) && Boolean(onTranscribe);

  if (showPreview) {
    return (
      <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
        <audio controls src={previewUrl ?? undefined} className="w-full" />
        {uploadedName && <p className="text-xs text-foreground-500 mt-2">{uploadedName}</p>}
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <button
            type="button"
            onClick={handleReRecord}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
          >
            <i className="ri-refresh-line" />
            Re-record
          </button>
          {canTranscribe && (
            <button
              type="button"
              onClick={() => onTranscribe?.(recorder.transcript as string)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-700 cursor-pointer"
            >
              <i className="ri-file-text-line" />
              Speech to text
            </button>
          )}
        </div>
      </div>
    );
  }

  if (recorder.status === 'recording') {
    return (
      <div className="rounded-2xl border border-background-200 bg-background-50 p-4 flex items-center gap-4">
        <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
          <div className="absolute w-10 h-10 rounded-full border-2 border-accent-300/60 animate-ripple-1" />
          <div className="w-3 h-3 rounded-full bg-accent-500" />
        </div>
        <span className="font-mono text-sm text-foreground-700">{formatDuration(recorder.durationSeconds)}</span>
        <div className="flex items-end gap-1 h-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1 bg-accent-400 rounded-full animate-sound-bar"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={recorder.stop}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-accent-500 text-background-50 hover:bg-accent-600 transition-colors duration-200 cursor-pointer"
        >
          <i className="ri-stop-circle-line" />
          Stop
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-background-300 bg-background-50 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => recorder.start(recognitionLang)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer"
        >
          <i className="ri-mic-line" />
          Record audio
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-background-300 text-foreground-700 hover:bg-background-100 transition-colors duration-200 cursor-pointer"
        >
          <i className="ri-upload-2-line" />
          Upload file
        </button>
        <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
      </div>
      {recorder.status === 'requesting-permission' && (
        <p className="text-xs text-foreground-500 mt-2">Requesting microphone access...</p>
      )}
      {recorder.error && <p className="text-xs text-accent-600 mt-2">{recorder.error}</p>}
      <p className="text-xs text-foreground-400 mt-2">Optional — pronunciation audio helps other learners.</p>
    </div>
  );
}
