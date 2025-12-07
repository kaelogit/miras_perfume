import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { journalData } from '../data/journalData';

const JournalPost = () => {
  const { id } = useParams();
  const article = journalData.find(a => a.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="font-serif text-2xl text-slate-900 mb-4">Story Not Found</h2>
        <Link to="/journal" className="text-brand-DEFAULT underline">Back to Journal</Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white pt-32 pb-20">
      
      <div className="w-full h-[50vh] relative mb-12">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-white/90 text-xs font-bold uppercase tracking-widest mb-4 bg-brand-DEFAULT px-4 py-1 rounded-full">
            {article.category}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-white max-w-4xl leading-tight">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <div 
          className="prose prose-slate prose-lg first-letter:text-5xl first-letter:font-serif first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
        
        <div className="mt-16 pt-8 border-t border-slate-100 text-center">
          <Link to="/journal" className="inline-block border border-slate-300 px-8 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-colors rounded-sm">
            Read More Stories
          </Link>
        </div>
      </div>

    </article>
  );
};

export default JournalPost;