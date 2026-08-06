import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { approveTranslation, getPhrase, getTranslation, rejectTranslation } from '@/api';
import type { Phrase, Translation } from '@/types/studio';
import StatusBadge from '../shared/StatusBadge';

export default function DetailPage() {
  const { translationId: translationIdParam } = useParams<{ translationId: string }>();
  const translationId = Number(translationIdParam);
  const navigate = useNavigate();

  const [translation, setTranslation] = useState<Translation | null>(null);
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!translationId) return;
    const t = await getTranslation(translationId);
    if (!t) {
      setLoading(false);
      return;
    }
    const phraseData = await getPhrase(t.phrase);
    setTranslation(t);
    setPhrase(phraseData);
    setLoading(false);
  }, [translationId]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (key: string, action: () => Promise<unknown>) => {
    setBusy(key);
    setError(null);
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <p className="text-sm text-foreground-500">Loading submission...</p>;

  if (!translation || !phrase) {
    return (
      <div>
        <p className="text-sm text-foreground-500">This submission couldn&apos;t be found.</p>
        <Link to="/studio/review" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Back to queue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link to="/studio/review" className="inline-flex items-center gap-1.5 text-sm text-foreground-500 hover:text-foreground-800 mb-6 cursor-pointer">
        <i className="ri-arrow-left-line" />
        Back to queue
      </Link>

      <div className="flex items-center justify-between gap-4 mb-2">
        {/* /api/users/ is admin-only, so a Reviewer has no documented way to resolve a contributor's name. */}
        <span className="text-xs font-medium text-foreground-500 uppercase tracking-wide">
          {translation.language_name} · Contributor #{translation.contributor}
        </span>
        <StatusBadge status={translation.status} />
      </div>
      <h1 className="font-heading text-2xl text-foreground-900 mb-6">{phrase.text}</h1>

      {error && <p className="text-sm text-accent-600 mb-4">{error}</p>}

      <div className="bg-background-50 border border-background-200 rounded-2xl p-5 mb-6">
        <p className="text-xs font-medium text-foreground-500 mb-2">Translation</p>
        <p className="text-sm text-foreground-900">{translation.text}</p>
      </div>

      {translation.audio_recordings.length > 0 && (
        <div className="bg-background-50 border border-background-200 rounded-2xl p-5 mb-6">
          <p className="text-xs font-medium text-foreground-500 mb-2">Pronunciation audio</p>
          <div className="space-y-2">
            {translation.audio_recordings.map((audio) => (
              <audio key={audio.id} controls src={audio.audio_url} className="w-full" />
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-xs font-medium text-foreground-600 mb-1">Feedback</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Explain what needs fixing, or leave a note on why it was approved..."
          className="w-full px-3 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-900 outline-none focus:border-primary-400 transition-colors duration-200"
        />
      </div>

      {translation.status === 'pending' ? (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => runAction('approve', () => approveTranslation(translation.id, { comment }))}
            className="px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            Approve
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => runAction('reject', () => rejectTranslation(translation.id, { comment }))}
            className="px-4 py-2 rounded-full text-sm font-medium bg-accent-100 text-accent-800 hover:bg-accent-200 transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => navigate('/studio/review')}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
        >
          Done — back to queue
        </button>
      )}
    </div>
  );
}
