import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPhrases, listReviews, listTranslations } from '@/api';
import type { Phrase, Review, Translation } from '@/types/studio';
import { useStudioAuth } from '../layout/useStudioAuth';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

export default function MySubmissionsPage() {
  const { user } = useStudioAuth();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [mine, phraseList] = await Promise.all([listTranslations({ contributorId: user.id }), listPhrases()]);
      setTranslations(mine.sort((a, b) => b.created_at.localeCompare(a.created_at)));
      setPhrases(phraseList);
      const allReviews = await Promise.all(mine.map((t) => listReviews({ translationId: t.id })));
      setReviews(allReviews.flat());
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <p className="text-sm text-foreground-500">Loading your submissions...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">My submissions</h1>
        <p className="text-sm text-foreground-500 mt-1">Track the status of everything you&apos;ve translated.</p>
      </div>

      {translations.length === 0 ? (
        <EmptyState
          icon="ri-file-list-3-line"
          title="No submissions yet"
          description="Head to Phrases to submit your first translation."
          action={
            <Link
              to="/studio/contribute"
              className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer"
            >
              Browse phrases
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {translations.map((t) => {
            const phrase = phrases.find((p) => p.id === t.phrase);
            const isExpanded = expandedId === t.id;
            const latestReview = reviews
              .filter((r) => r.translation === t.id)
              .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

            return (
              <div key={t.id} className="bg-background-50 border border-background-200 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-foreground-500 uppercase tracking-wide">{t.language_name}</span>
                    <p className="text-sm text-foreground-900 mt-1">{phrase?.text}</p>
                    <p className="text-sm text-foreground-600 mt-1 italic">"{t.text}"</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-foreground-400">{new Date(t.created_at).toLocaleDateString()}</span>
                  {latestReview?.comment && (
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : t.id)}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
                    >
                      {isExpanded ? 'Hide feedback' : 'View feedback'}
                    </button>
                  )}
                  {t.status === 'rejected' && (
                    <Link
                      to={`/studio/contribute/${t.phrase}?languageId=${t.language}${t.dialect ? `&dialectId=${t.dialect}` : ''}`}
                      className="text-xs font-medium text-accent-600 hover:text-accent-700 cursor-pointer"
                    >
                      Edit &amp; resubmit
                    </Link>
                  )}
                </div>

                {isExpanded && latestReview?.comment && (
                  <div className="mt-3 bg-background-100 rounded-xl p-3">
                    <p className="text-sm text-foreground-700">{latestReview.comment}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
