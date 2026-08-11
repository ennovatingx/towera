import { useEffect } from 'react';

/**
 * Sets the document title (and meta description, if provided) for as long as
 * the calling page is mounted, restoring whatever was there before on unmount.
 * This is a CSR-only fix — it updates the live DOM after JS runs, so it helps
 * JS-executing crawlers (Google) and real users, but not crawlers that only
 * read the static HTML (most AI bots) — those only ever see index.html's tags.
 */
export function useDocumentMeta(title: string, description?: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const descriptionTag = description ? document.querySelector('meta[name="description"]') : null;
    const previousDescription = descriptionTag?.getAttribute('content') ?? null;
    if (descriptionTag && description) {
      descriptionTag.setAttribute('content', description);
    }

    return () => {
      document.title = previousTitle;
      if (descriptionTag && previousDescription !== null) {
        descriptionTag.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
}
