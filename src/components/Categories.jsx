import React from 'react';

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: "Arabian Luxury",
      handle: "arabian-oud",
      desc: "Lattafa & Middle Eastern Gems.",
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35e4?q=80&w=2574&auto=format&fit=crop", 
      btnText: "Shop Arabian"
    },
    {
      id: 2,
      title: "Designer Icons",
      handle: "designer-brands",
      desc: "Dior, Chanel, YSL.",
      image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=2535&auto=format&fit=crop",
      btnText: "Shop Designer"
    },
    {
      id: 3,
      title: "Niche Exclusives",
      handle: "niche-collection",
      desc: "Creed, MFK, Roja.",
      image: "https://images.unsplash.com/photo-1617239476458-9569a5c435b9?q=80&w=2574&auto=format&fit=crop", 
      btnText: "Shop Niche"
    }
  ];

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-3">
            Browse by Collection
          </h2>
          <p className="text-slate-500 font-light text-sm md:text-base max-w-lg mx-auto">
            From trending Arabian Ouds to timeless French classics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              // FIXED: h-[280px] for mobile, h-[500px] for desktop
              className="group relative h-[280px] md:h-[500px] overflow-hidden rounded-md shadow-sm hover:shadow-md transition-shadow"
            >
              <a href={`/shop/${cat.handle}`} className="block h-full w-full">
                <div className="absolute inset-0 bg-slate-200">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-serif text-xl md:text-2xl text-white mb-1 tracking-wide drop-shadow-md">
                    {cat.title}
                  </h3>
                  <p className="text-white/90 text-xs md:text-sm font-medium mb-4 drop-shadow-sm">
                    {cat.desc}
                  </p>
                  <span className="inline-block px-4 py-2 border border-white text-white text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-slate-900 transition-colors duration-300 rounded-sm">
                    {cat.btnText}
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;