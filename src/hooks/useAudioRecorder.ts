import { useCallback, useEffect, useRef, useState } from 'react';

export type RecorderStatus = 'idle' | 'requesting-permission' | 'recording' | 'recorded' | 'error';

export interface UseAudioRecorderResult {
  status: RecorderStatus;
  durationSeconds: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  mimeType: string | null;
  transcript: string | null;
  transcriptSupported: boolean;
  error: string | null;
  start: (lang?: string) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

const transcriptSupported =
  typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

export function useAudioRecorder(): UseAudioRecorderResult {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const revokePreviousUrl = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore — already stopped
      }
      recognitionRef.current = null;
    }
  }, []);

  const startRecognition = useCallback((lang?: string) => {
    if (!transcriptSupported) return;
    transcriptRef.current = '';
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    if (lang) recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
      }
      if (finalText) {
        transcriptRef.current = `${transcriptRef.current} ${finalText}`.trim();
      }
    };
    // Recognition can end on its own (e.g. a silence timeout) well before the
    // recording stops — that's fine, we just keep whatever was captured so far.
    recognition.onerror = () => {};

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      recognitionRef.current = null;
    }
  }, []);

  const start = useCallback(
    async (lang?: string) => {
      if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setStatus('error');
        setError('Audio recording is not supported in this browser.');
        return;
      }

      setError(null);
      revokePreviousUrl();
      setAudioUrl(null);
      setAudioBlob(null);
      setTranscript(null);
      setDurationSeconds(0);
      setStatus('requesting-permission');

      try {
        // Let the browser's own audio pipeline strip room echo, steady background
        // noise, and normalize mic volume before we ever see the samples — no
        // extra processing needed on our end.
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        streamRef.current = stream;
        chunksRef.current = [];

        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) chunksRef.current.push(event.data);
        };

        recorder.onstop = () => {
          clearTimer();
          stopTracks();
          stopRecognition();
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          const url = URL.createObjectURL(blob);
          audioUrlRef.current = url;
          setAudioBlob(blob);
          setAudioUrl(url);
          setMimeType(recorder.mimeType || 'audio/webm');
          setTranscript(transcriptRef.current.trim() || null);
          setStatus('recorded');
        };

        recorder.start();
        startRecognition(lang);
        setStatus('recording');
        intervalRef.current = setInterval(() => {
          setDurationSeconds((prev) => prev + 1);
        }, 1000);
      } catch {
        setStatus('error');
        setError('Microphone permission was denied. You can still upload an audio file instead.');
      }
    },
    [clearTimer, revokePreviousUrl, stopTracks, stopRecognition, startRecognition]
  );

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    stopTracks();
    stopRecognition();
    revokePreviousUrl();
    chunksRef.current = [];
    transcriptRef.current = '';
    setAudioBlob(null);
    setAudioUrl(null);
    setMimeType(null);
    setTranscript(null);
    setDurationSeconds(0);
    setError(null);
    setStatus('idle');
  }, [clearTimer, stopTracks, stopRecognition, revokePreviousUrl]);

  useEffect(() => {
    return () => {
      clearTimer();
      stopTracks();
      stopRecognition();
      revokePreviousUrl();
    };
  }, [clearTimer, stopTracks, stopRecognition, revokePreviousUrl]);

  return {
    status,
    durationSeconds,
    audioBlob,
    audioUrl,
    mimeType,
    transcript,
    transcriptSupported,
    error,
    start,
    stop,
    reset,
  };
}
