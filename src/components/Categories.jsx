import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: "Arabian Luxury",
      link: "/shop?type=arabian", 
      desc: "Rich Ouds & Long-lasting Gems.",
      image: "/images/categories/arabian.jpg", 
      btnText: "Shop Arabian"
    },
    {
      id: 2,
      title: "Designer Icons",
      link: "/shop?type=designer",
      desc: "Dior, Chanel, YSL Classics.",
      image: "/images/categories/designer.jpg",
      btnText: "Shop Designer"
    },
    {
      id: 3,
      title: "Niche Exclusives",
      link: "/shop?type=niche",
      desc: "Creed, MFK, Roja Parfums.",
      image: "/images/categories/niche.jpg", 
      btnText: "Shop Niche"
    },
    {
      id: 4,
      title: "Combos & Sets",
      link: "/shop?type=combo",
      desc: "Perfect Gift Sets & Bundles.",
      image: "/images/categories/set.jpg", 
      btnText: "Shop Sets"
    }
  ];

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-3">
            Curated Collections
          </h2>
          <p className="text-slate-500 font-light text-sm md:text-base max-w-lg mx-auto">
            Explore our hand-picked categories for every personality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="group relative h-[280px] md:h-[450px] overflow-hidden rounded-md shadow-sm hover:shadow-md transition-shadow"
            >
              <Link to={cat.link} className="block h-full w-full">
                <div className="absolute inset-0 bg-slate-200">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-serif text-lg md:text-xl text-white mb-1 tracking-wide drop-shadow-md">
                    {cat.title}
                  </h3>
                  <p className="text-white/90 text-xs md:text-sm font-medium mb-4 drop-shadow-sm">
                    {cat.desc}
                  </p>
                  <span className="inline-block px-4 py-2 border border-white text-white text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-slate-900 transition-colors duration-300 rounded-sm">
                    {cat.btnText}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;