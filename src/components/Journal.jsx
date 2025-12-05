import React from 'react';

const Journal = () => {
  const articles = [
    {
      id: 1,
      title: "How to Make Your Scent Last All Day",
      category: "Expert Tips",
      // RELIABLE IMAGE: Minimalist bottles/skincare vibe
      image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=2671&auto=format&fit=crop", 
      excerpt: "Pulse points, moisturizing, and the art of layering. Discover the secrets to keeping your designer fragrance alive from morning to night."
    },
    {
      id: 2,
      title: "Top 5 Scents for Lagos Heat",
      category: "Curated Guides",
      // RELIABLE IMAGE: Fresh nature/bright vibe
      image: "https://images.unsplash.com/photo-1541108564883-b6848dc96a58?q=80&w=2671&auto=format&fit=crop", 
      excerpt: "Humid weather demands a different kind of fragrance. We break down the best fresh and citrus notes that withstand the tropical climate."
    }
  ];

  return (
    <section className="bg-white py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-slate-900">
            The Journal
          </h2>
          <a href="#" className="hidden md:block text-brand-DEFAULT text-sm font-medium hover:text-brand-dark transition-colors">
            View All Stories &rarr;
          </a>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {articles.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              
              {/* Image Container with Zoom Effect */}
              <div className="overflow-hidden rounded-md mb-6 shadow-sm bg-slate-100">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Text Content */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-brand-DEFAULT uppercase tracking-widest">
                  {article.category}
                </span>
                <h3 className="font-serif text-2xl text-slate-800 group-hover:text-brand-DEFAULT transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-500 font-light leading-relaxed max-w-md">
                  {article.excerpt}
                </p>
                <span className="inline-block pt-2 text-slate-900 text-sm border-b border-slate-300 pb-0.5 group-hover:border-brand-DEFAULT transition-colors">
                  Read Story
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-12 text-center md:hidden">
          <a href="#" className="text-brand-DEFAULT text-sm font-medium hover:text-brand-dark">
            View All Stories &rarr;
          </a>
        </div>

      </div>
    </section>
  );
};

export default Journal;