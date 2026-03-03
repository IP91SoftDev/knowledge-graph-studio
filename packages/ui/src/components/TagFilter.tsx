'use client';

import { useState } from 'react';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

interface TagFilterProps {
  tags: Tag[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function TagFilter({ tags, selected, onChange }: TagFilterProps) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase()) ||
      tag.slug.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTag = (slug: string) => {
    if (selected.includes(slug)) {
      onChange(selected.filter((s) => s !== slug));
    } else {
      onChange([...selected, slug]);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-900"
      >
        Tags ({selected.length})
        <span className="text-gray-500">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          <input
            type="text"
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
            {filteredTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.slug)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  selected.includes(tag.slug)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={
                  selected.includes(tag.slug) && tag.color
                    ? { backgroundColor: tag.color }
                    : undefined
                }
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
