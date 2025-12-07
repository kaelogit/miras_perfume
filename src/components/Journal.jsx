import React from 'react';
import { Link } from 'react-router-dom';

const Journal = () => {
  const articles = [
    { 
      id: 1, 
      title: "How to Make Your Scent Last All Day", 
      category: "Expert Tips", 
      image: "/images/journal/1.jpg", 
      excerpt: "Pulse points, moisturizing, and the art of layering. Discover the secrets to longevity." 
    },
    { 
      id: 2, 
      title: "Top 5 Scents for Nigerian Heat", 
      category: "Curated Guides", 
      image: "/images/journal/2.jpg", 
      excerpt: "Humid weather demands a different kind of fragrance. We break down the best fresh notes." 
    },
    { 
      id: 3, 
      title: "Oud 101: Understanding the Gold", 
      category: "Ingredient Spotlight", 
      image: "/images/journal/3.jpg", 
      excerpt: "Why is Oud so expensive? Dive into the history of perfumery's most precious wood." 
    },
    { 
      id: 4, 
      title: "The Difference Between EDT and EDP", 
      category: "Education", 
      image: "/images/journal/4.jpg", 
      excerpt: "Eau de Toilette vs. Eau de Parfum. Which concentration is right for your lifestyle?" 
    },
    { 
      id: 5, 
      title: "Layering Scents Like a Pro", 
      category: "How-To", 
      image: "/images/journal/5.jpg", 
      excerpt: "Create a signature scent that is uniquely yours by mixing complementary fragrance notes." 
    },
    { 
      id: 6, 
      title: "Why Niche Perfumes Are Worth It", 
      category: "Opinion", 
      image: "/images/journal/6.jpg", 
      excerpt: "Moving beyond the department store: Why connoisseurs invest in artisanal craftsmanship." 
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <h2 className="font-serif text-2xl md:text-4xl text-slate-900">The Journal</h2>
          <Link to="/journal" className="hidden md:block text-slate-400 text-sm font-medium hover:text-brand-DEFAULT cursor-pointer transition-colors">Read More &rarr;</Link>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 md:grid md:grid-cols-3 md:gap-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
          {articles.map((article) => (
            <Link to={`/journal/${article.id}`} key={article.id} className="group cursor-pointer min-w-[280px] md:min-w-0 snap-center block">
              <div className="overflow-hidden rounded-sm mb-4 shadow-sm bg-slate-100 h-64 md:h-80">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-brand-DEFAULT uppercase tracking-widest">{article.category}</span>
                <h3 className="font-serif text-xl text-slate-800 group-hover:text-brand-DEFAULT transition-colors leading-tight">{article.title}</h3>
                <p className="text-sm text-slate-500 font-light line-clamp-2">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center md:hidden mt-2">
           <Link to="/journal" className="text-brand-DEFAULT text-sm font-medium">Swipe for more stories &rarr;</Link>
        </div>

      </div>
    </section>
  );
};

export default Journal;