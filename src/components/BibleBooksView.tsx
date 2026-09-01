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
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider rounded-full shadow-xs">
          <Library className="w-3.5 h-3.5 text-emerald-600" />
          <span>Kanon Biblijny i Sigla</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Księgi i Sigla Biblijne
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Szybki leksykon 73 ksiąg Pisma Świętego (Stary i Nowy Testament) wraz z oficjalnymi skrótami
        </p>
      </div>

      {/* Controls / Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="search-books-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj księgi, np. Rdz, Iz, Jan..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 self-center">
          <button
            id="filter-books-all"
            onClick={() => setFilterTestament('ALL')}
            className={`px-3 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xl border ${
              filterTestament === 'ALL'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Wszystkie (73)
          </button>
          <button
            id="filter-books-st"
            onClick={() => setFilterTestament('ST')}
            className={`px-3 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xl border ${
              filterTestament === 'ST'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Stary Testament (46)
          </button>
          <button
            id="filter-books-nt"
            onClick={() => setFilterTestament('NT')}
            className={`px-3 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xl border ${
              filterTestament === 'NT'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
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
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-base font-bold text-emerald-900 px-2.5 py-0.5 bg-emerald-50 rounded-lg border border-emerald-200">
                {book.siglum}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded-md text-slate-600 border border-slate-200">
                {book.testament}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                {book.fullName}
              </h3>
              <p className="text-[11px] text-slate-500 font-sans italic">
                {book.latinName}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium">{book.category}</span>
              <span>{book.chaptersCount} rozdz.</span>
            </div>

            {onSelectBookForScrutation && (
              <button
                id={`select-book-${book.siglum}`}
                onClick={() => onSelectBookForScrutation(book.siglum)}
                className="w-full mt-2 py-2 bg-slate-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-sans font-bold uppercase tracking-wider transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200 hover:border-emerald-600 shadow-xs"
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
