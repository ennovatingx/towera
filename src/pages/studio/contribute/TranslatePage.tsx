import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  getPhrase,
  listDialects,
  listLanguages,
  listReviews,
  listTranslations,
  requestAudioUploadSlot,
  submitTranslation,
  updateTranslationText,
  uploadAudioBlob,
} from '@/api';
import type { AudioSource, Dialect, Language, Phrase, Review, Translation } from '@/types/studio';
import { formatNaira, weightToNaira } from '@/lib/payout';
import { useStudioAuth } from '../layout/useStudioAuth';
import AudioRecorder from '../shared/AudioRecorder';
import StatusBadge from '../shared/StatusBadge';

interface CapturedAudio {
  blob: Blob;
  source: AudioSource;
  fileName?: string;
  durationSeconds?: number;
  mimeType: string;
}

export default function TranslatePage() {
  const { phraseId: phraseIdParam } = useParams<{ phraseId: string }>();
  const phraseId = Number(phraseIdParam);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useStudioAuth();

  const languageId = searchParams.get('languageId') ?? '';
  const dialectId = searchParams.get('dialectId') ?? '';

  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [dialects, setDialects] = useState<Dialect[]>([]);
  const [existing, setExisting] = useState<Translation | null>(null);
  const [latestReview, setLatestReview] = useState<Review | null>(null);
  const [text, setText] = useState('');
  const [capturedAudio, setCapturedAudio] = useState<CapturedAudio | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    if (!phraseId || !languageId || !user) return;
    const [phraseData, languages, dialectList, translations] = await Promise.all([
      getPhrase(phraseId),
      listLanguages(),
      listDialects(Number(languageId)),
      listTranslations({ phraseId, languageId: Number(languageId), contributorId: user.id }),
    ]);
    setPhrase(phraseData);
    setLanguage(languages.find((l) => l.id === Number(languageId)) ?? null);
    setDialects(dialectList);

    const mine = translations[0] ?? null;
    setExisting(mine);
    setText(mine?.text ?? '');

    if (mine?.status === 'rejected') {
      const reviews = await listReviews({ translationId: mine.id });
      setLatestReview(reviews.sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null);
    } else {
      setLatestReview(null);
    }
    setLoading(false);
  }, [phraseId, languageId, user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDialectChange = (value: string) => {
    setSearchParams({ languageId, dialectId: value });
  };

  const handleCapture = useCallback(
    (blob: Blob, source: AudioSource, meta: { fileName?: string; durationSeconds?: number; mimeType: string }) => {
      setCapturedAudio({ blob, source, ...meta });
    },
    []
  );

  const handleTranscribe = useCallback((transcript: string) => {
    setText(transcript);
  }, []);

  // Best-effort BCP-47 tag for the target language, so browser speech recognition
  // has a shot at the right language — support for Nigerian languages is spotty.
  const recognitionLang = language?.code ? `${language.code}-NG` : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phraseId || !languageId) return;
    setSubmitting(true);
    setError(null);
    try {
      const translation = existing
        ? await updateTranslationText(existing.id, text)
        : await submitTranslation({
            phraseId,
            languageId: Number(languageId),
            dialectId: dialectId ? Number(dialectId) : undefined,
            text,
          });

      if (capturedAudio) {
        const slot = await requestAudioUploadSlot(translation.id, {
          fileName: capturedAudio.fileName ?? 'recording.webm',
          contentType: capturedAudio.mimeType,
        });
        await uploadAudioBlob(slot, capturedAudio.blob, {
          durationSeconds: capturedAudio.durationSeconds,
        });
      }

      setSuccess(true);
      setTimeout(() => navigate('/studio/contribute/my-submissions'), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-sm text-foreground-500">Loading phrase...</p>;

  if (!phrase || !language) {
    return (
      <div>
        <p className="text-sm text-foreground-500">This phrase or language couldn&apos;t be found.</p>
        <Link to="/studio/contribute" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Back to phrases
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link to="/studio/contribute" className="inline-flex items-center gap-1.5 text-sm text-foreground-500 hover:text-foreground-800 mb-6 cursor-pointer">
        <i className="ri-arrow-left-line" />
        Back to phrases
      </Link>

      <div className="flex items-center justify-between gap-4 mb-2">
        <span className="text-xs font-medium text-foreground-500 uppercase tracking-wide">
          {phrase.source_language_name} &rarr; {language.name}
        </span>
        {existing && <StatusBadge status={existing.status} />}
      </div>
      <h1 className="font-heading text-2xl text-foreground-900 mb-2">{phrase.text}</h1>
      <p className="text-sm font-medium text-primary-700 mb-6">
        <i className="ri-wallet-3-line mr-1" />
        {formatNaira(weightToNaira(phrase.weight))} on approval
      </p>

      {latestReview && (
        <div className="bg-accent-50 border border-accent-200 rounded-2xl p-4 mb-6">
          <p className="text-xs font-medium text-accent-700 mb-1">Reviewer feedback</p>
          <p className="text-sm text-accent-800">{latestReview.comment}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-foreground-600 mb-1">Dialect (optional)</label>
          <select
            value={dialectId}
            onChange={(e) => handleDialectChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-background-300 bg-background-50 text-sm outline-none focus:border-primary-400 transition-colors duration-200"
          >
            <option value="">No specific dialect</option>
            {dialects.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground-600 mb-1">Your translation</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-900 outline-none focus:border-primary-400 transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground-600 mb-1">Pronunciation audio</label>
          <AudioRecorder
            onCapture={handleCapture}
            onTranscribe={handleTranscribe}
            existingAudioUrl={null}
            recognitionLang={recognitionLang}
          />
        </div>

        {error && <p className="text-sm text-accent-600">{error}</p>}
        {success && <p className="text-sm text-primary-600">Submitted! Redirecting to your submissions...</p>}

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : existing ? 'Resubmit translation' : 'Submit translation'}
        </button>
      </form>
    </div>
  );
}
