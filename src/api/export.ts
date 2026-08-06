import type { DatasetRow } from '@/types/studio';
import { getAccessToken, request } from './client';

export type ExportFormat = 'json' | 'csv';
export type ExportStatus = 'approved' | 'pending' | 'rejected' | 'all';

export interface ExportFilter {
  languageId?: number;
  dialectId?: number;
  category?: string;
  status?: ExportStatus;
}

interface DatasetExportResponse {
  count: number;
  results: DatasetRow[];
}

function buildQuery(format: ExportFormat, filter?: ExportFilter): string {
  const params = new URLSearchParams();
  params.set('export_format', format);
  params.set('status', filter?.status ?? 'approved');
  if (filter?.languageId) params.set('language', String(filter.languageId));
  if (filter?.dialectId) params.set('dialect', String(filter.dialectId));
  if (filter?.category) params.set('category', filter.category);
  return params.toString();
}

export async function buildExportDataset(filter?: ExportFilter): Promise<DatasetRow[]> {
  const response = await request<DatasetExportResponse>(`/api/export/dataset/?${buildQuery('json', filter)}`);
  return response.results;
}

function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function exportDataset(format: ExportFormat, filter?: ExportFilter): Promise<void> {
  const timestamp = new Date().toISOString().slice(0, 10);

  if (format === 'json') {
    const rows = await buildExportDataset(filter);
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    downloadBlob(`towera-dataset-${timestamp}.json`, blob);
    return;
  }

  const base = import.meta.env.VITE_API_BASE_URL;
  const res = await fetch(`${base}/api/export/dataset/?${buildQuery('csv', filter)}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error(`Export failed (${res.status})`);
  const blob = await res.blob();
  downloadBlob(`towera-dataset-${timestamp}.csv`, blob);
}
