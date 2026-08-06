import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listDialects, listLanguages, listPhrases, listTranslations } from '@/api';
import type { Dialect, Language, Phrase, TranslationStatus, Translation } from '@/types/studio';
import { formatNaira, weightToNaira } from '@/lib/payout';
import { useStudioAuth } from '../layout/useStudioAuth';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

export default function PhraseListPage() {
  const { user } = useStudioAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [dialects, setDialects] = useState<Dialect[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [myTranslations, setMyTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);

  const languageId = searchParams.get('languageId') ?? '';
  const dialectId = searchParams.get('dialectId') ?? '';

  useEffect(() => {
    // Guard against setSearchParams firing after the user has already
    // navigated away — unlike plain state setters, it acts on router
    // history directly and would yank them back to this page.
    let cancelled = false;
    (async () => {
      const [langs, phraseList, translations] = await Promise.all([
        listLanguages(),
        listPhrases(),
        listTranslations({ contributorId: user!.id }),
      ]);
      if (cancelled) return;
      setLanguages(langs);
      setPhrases(phraseList);
      setMyTranslations(translations);
      if (!languageId && langs.length > 0) {
        setSearchParams({ languageId: String(langs[0].id) });
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, languageId, setSearchParams]);

  useEffect(() => {
    if (!languageId) return;
    listDialects(Number(languageId)).then(setDialects);
  }, [languageId]);

  const handleLanguageChange = (value: string) => {
    setSearchParams({ languageId: value });
  };

  const statusFor = (phraseId: number): TranslationStatus | 'not-started' => {
    const translation = myTranslations.find((t) => t.phrase === phraseId && t.language === Number(languageId));
    return translation?.status ?? 'not-started';
  };

  const translatablePhrases = phrases.filter((p) => {
    if (!languageId) return true;
    if (p.source_language === Number(languageId)) return false; // can't translate a phrase into its own source language
    return statusFor(p.id) === 'not-started'; // nothing left to do once you've already submitted for this language
  });

  if (loading) return <p className="text-sm text-foreground-500">Loading phrases...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Phrases to translate</h1>
        <p className="text-sm text-foreground-500 mt-1">Choose a language, then pick a phrase to translate into it.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={languageId}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-3 py-2 rounded-xl border border-background-300 bg-background-50 text-sm outline-none focus:border-primary-400 transition-colors duration-200"
        >
          {languages.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <select
          value={dialectId}
          onChange={(e) => setSearchParams({ languageId, dialectId: e.target.value })}
          className="px-3 py-2 rounded-xl border border-background-300 bg-background-50 text-sm outline-none focus:border-primary-400 transition-colors duration-200"
        >
          <option value="">Any dialect</option>
          {dialects.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {translatablePhrases.length === 0 ? (
        <EmptyState
          icon="ri-checkbox-circle-line"
          title="Nothing here to do!"
          description="You've submitted a translation for every available phrase in this language. Pick another language, or check back later for new phrases."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {translatablePhrases.map((phrase) => {
            const status = statusFor(phrase.id);
            return (
              <Link
                key={phrase.id}
                to={`/studio/contribute/${phrase.id}?languageId=${languageId}${dialectId ? `&dialectId=${dialectId}` : ''}`}
                className="block bg-background-50 border border-background-200 rounded-2xl p-5 hover:border-primary-300 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-foreground-500 uppercase tracking-wide">
                    {phrase.source_language_name}
                    {phrase.category ? ` · ${phrase.category}` : ''}
                  </span>
                  {status !== 'not-started' && <StatusBadge status={status} />}
                </div>
                <p className="text-sm text-foreground-900 leading-relaxed">{phrase.text}</p>
                <p className="text-xs font-medium text-primary-700 mt-3">
                  <i className="ri-wallet-3-line mr-1" />
                  {formatNaira(weightToNaira(phrase.weight))} on approval
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
