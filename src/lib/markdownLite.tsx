import type { ReactNode } from 'react';

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let n = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b-${n++}`}>{match[1]}</strong>);
    } else {
      const isExternal = /^https?:\/\//.test(match[3]);
      nodes.push(
        <a
          key={`${keyPrefix}-a-${n++}`}
          href={match[3]}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {match[2]}
        </a>
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

type Block = { kind: 'h2' | 'h3' | 'p'; text: string } | { kind: 'ul'; items: string[] };

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push({ kind: 'h3', text: line.slice(4).trim() });
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push({ kind: 'h2', text: line.slice(3).trim() });
      i++;
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      blocks.push({ kind: 'ul', items });
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('## ') &&
      !lines[i].startsWith('### ') &&
      !lines[i].startsWith('- ')
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ kind: 'p', text: paraLines.join(' ') });
  }

  return blocks;
}

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.kind) {
    case 'h2':
      return <h2 key={key}>{parseInline(block.text, `h2-${key}`)}</h2>;
    case 'h3':
      return <h3 key={key}>{parseInline(block.text, `h3-${key}`)}</h3>;
    case 'ul':
      return (
        <ul key={key}>
          {block.items.map((item, idx) => (
            <li key={idx}>{parseInline(item, `li-${key}-${idx}`)}</li>
          ))}
        </ul>
      );
    case 'p':
      return <p key={key}>{parseInline(block.text, `p-${key}`)}</p>;
  }
}

/**
 * Minimal markdown subset for admin-editable legal content: ## / ### headings,
 * "- " bullet lists, blank-line-separated paragraphs, **bold**, and [text](url)
 * links. Not a general-purpose parser — just enough to cover the Privacy
 * Policy / Terms of Service content.
 */
export function parseMarkdownLite(source: string): ReactNode[] {
  return parseBlocks(source).map(renderBlock);
}

export interface MarkdownSection {
  title: string;
  body: ReactNode[];
}

export interface ParsedLegalDocument {
  /** Everything before the first "## " heading — the document's lead paragraph. */
  intro: ReactNode[];
  sections: MarkdownSection[];
}

/** Groups content by top-level "## " headings — powers the accordion-style legal page layout. */
export function parseMarkdownLiteSections(source: string): ParsedLegalDocument {
  const blocks = parseBlocks(source);
  const introBlocks: Block[] = [];
  const sections: MarkdownSection[] = [];
  let current: { title: string; blocks: Block[] } | null = null;

  for (const block of blocks) {
    if (block.kind === 'h2') {
      if (current) sections.push({ title: current.title, body: current.blocks.map(renderBlock) });
      current = { title: block.text, blocks: [] };
    } else if (current) {
      current.blocks.push(block);
    } else {
      introBlocks.push(block);
    }
  }
  if (current) sections.push({ title: current.title, body: current.blocks.map(renderBlock) });

  return { intro: introBlocks.map(renderBlock), sections };
}
