import { useEffect, useState } from 'react';
import { buildExportDataset, exportDataset, listLanguages, type ExportStatus } from '@/api';
import type { Language } from '@/types/studio';

export default function ExportPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageId, setLanguageId] = useState('');
  const [status, setStatus] = useState<ExportStatus>('approved');
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [exporting, setExporting] = useState<'json' | 'csv' | null>(null);

  useEffect(() => {
    listLanguages().then(setLanguages);
  }, []);

  useEffect(() => {
    let cancelled = false;
    buildExportDataset({ languageId: languageId ? Number(languageId) : undefined, status }).then((rows) => {
      if (!cancelled) setMatchCount(rows.length);
    });
    return () => {
      cancelled = true;
    };
  }, [languageId, status]);

  const handleExport = async (format: 'json' | 'csv') => {
    setExporting(format);
    try {
      await exportDataset(format, { languageId: languageId ? Number(languageId) : undefined, status });
    } finally {
      setExporting(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Export dataset</h1>
        <p className="text-sm text-foreground-500 mt-1">Download translations as a licensable dataset.</p>
      </div>

      <div className="bg-background-50 border border-background-200 rounded-2xl p-6 max-w-lg">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-foreground-600 mb-1">Language</label>
            <select
              value={languageId}
              onChange={(e) => setLanguageId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-background-300 bg-background-50 text-sm outline-none focus:border-primary-400 transition-colors duration-200"
            >
              <option value="">All languages</option>
              {languages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-600 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ExportStatus)}
              className="w-full px-3 py-2 rounded-xl border border-background-300 bg-background-50 text-sm outline-none focus:border-primary-400 transition-colors duration-200"
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-foreground-600 mb-5">
          <span className="font-heading text-xl text-foreground-900">{matchCount ?? '—'}</span> translation
          {matchCount === 1 ? '' : 's'} match this filter.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleExport('json')}
            disabled={exporting !== null || !matchCount}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            <i className="ri-download-2-line" />
            {exporting === 'json' ? 'Exporting...' : 'Export JSON'}
          </button>
          <button
            type="button"
            onClick={() => handleExport('csv')}
            disabled={exporting !== null || !matchCount}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium border border-background-300 text-foreground-700 hover:bg-background-100 transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            <i className="ri-download-2-line" />
            {exporting === 'csv' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>
    </div>
  );
}
