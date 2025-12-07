import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { journalData } from '../data/journalData';

const JournalIndex = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl text-slate-900 mb-4">The Journal</h1>
          <p className="text-slate-500 font-light">Expert advice, curated guides, and the art of perfumery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journalData.map((article) => (
            <Link to={`/journal/${article.id}`} key={article.id} className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-64 overflow-hidden bg-slate-100">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="p-8">
                <span className="text-[10px] font-bold text-brand-DEFAULT uppercase tracking-widest mb-2 block">
                  {article.category}
                </span>
                <h3 className="font-serif text-2xl text-slate-900 mb-3 group-hover:text-brand-DEFAULT transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="text-slate-500 font-light text-sm leading-relaxed mb-6">
                  {article.excerpt}
                </p>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
                  Read Story
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default JournalIndex;