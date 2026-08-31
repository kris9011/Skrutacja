import React, { useState } from 'react';
import { BIBLE_BOOKS } from '../data/biblicalData';
import { BibleBookInfo } from '../types';
import { Library, Search, BookOpen } from 'lucide-react';

interface BibleBooksViewProps {
  onSelectBookForScrutation?: (siglum: string) => void;
}

export const BibleBooksView: React.FC<BibleBooksViewProps> = ({ onSelectBookForScrutation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTestament, setFilterTestament] = useState<'ALL' | 'ST' | 'NT'>('ALL');

  const filteredBooks = BIBLE_BOOKS.filter((b) => {
    const matchesSearch =
      b.siglum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.polishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTestament =
      filterTestament === 'ALL' ? true : b.testament === filterTestament;

    return matchesSearch && matchesTestament;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 text-[#E0E0D6]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141417] border border-[#3D3524] text-[#C5A059] text-[10px] font-sans uppercase tracking-[0.3em]">
          <Library className="w-3.5 h-3.5" />
          Kanon Biblijny i Sigla
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-light tracking-wide text-[#C5A059]">
          Księgi i Sigla Biblijne
        </h1>
        <p className="text-xs sm:text-sm text-[#8C8270]">
          Szybki leksykon 73 ksiąg Pisma Świętego (Stary i Nowy Testament) wraz z oficjalnymi skrótami
        </p>
      </div>

      {/* Controls / Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C8270] absolute left-3.5 top-3" />
          <input
            id="search-books-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj księgi, np. Rdz, Iz, Jan..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#141417] border border-[#3D3524] focus:border-[#C5A059] focus:outline-none text-sm text-[#E0E0D6] placeholder-[#5a554a]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-center">
          <button
            id="filter-books-all"
            onClick={() => setFilterTestament('ALL')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider transition-all cursor-pointer border ${
              filterTestament === 'ALL'
                ? 'bg-[#1a1a1e] border-[#C5A059] text-[#C5A059]'
                : 'bg-[#141417] text-[#8C8270] hover:text-[#E0E0D6] border-[#3D3524]'
            }`}
          >
            Wszystkie (73)
          </button>
          <button
            id="filter-books-st"
            onClick={() => setFilterTestament('ST')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider transition-all cursor-pointer border ${
              filterTestament === 'ST'
                ? 'bg-[#1a1a1e] border-[#C5A059] text-[#C5A059]'
                : 'bg-[#141417] text-[#8C8270] hover:text-[#E0E0D6] border-[#3D3524]'
            }`}
          >
            Stary Testament (46)
          </button>
          <button
            id="filter-books-nt"
            onClick={() => setFilterTestament('NT')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider transition-all cursor-pointer border ${
              filterTestament === 'NT'
                ? 'bg-[#1a1a1e] border-[#C5A059] text-[#C5A059]'
                : 'bg-[#141417] text-[#8C8270] hover:text-[#E0E0D6] border-[#3D3524]'
            }`}
          >
            Nowy Testament (27)
          </button>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.siglum}
            className="p-4 bg-[#141417] border border-[#3D3524] hover:border-[#C5A059] transition-colors flex flex-col justify-between space-y-2 group"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-base font-bold text-[#C5A059] px-2 py-0.5 bg-[#0F0F12] border border-[#3D3524]">
                {book.siglum}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0F0F12] text-[#8C8270] border border-[#3D3524]">
                {book.testament}
              </span>
            </div>

            <div>
              <h3 className="font-display text-sm font-medium text-[#E0E0D6] group-hover:text-[#C5A059] transition-colors">
                {book.fullName}
              </h3>
              <p className="text-[11px] text-[#8C8270] font-sans italic">
                {book.latinName}
              </p>
            </div>

            <div className="pt-2 border-t border-[#3D3524] flex items-center justify-between text-[11px] text-[#8C8270]">
              <span>{book.category}</span>
              <span>{book.chaptersCount} rozdz.</span>
            </div>

            {onSelectBookForScrutation && (
              <button
                id={`select-book-${book.siglum}`}
                onClick={() => onSelectBookForScrutation(book.siglum)}
                className="w-full mt-2 py-1.5 bg-[#1a1a1e] hover:bg-[#C5A059] hover:text-[#0F0F12] text-[#C5A059] text-xs font-sans uppercase tracking-widest transition-colors flex items-center justify-center gap-1 cursor-pointer border border-[#3D3524] hover:border-[#C5A059]"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Skrutuj z {book.siglum}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
