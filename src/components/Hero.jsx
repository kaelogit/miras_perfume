import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [currentImage, setCurrentImage] = useState('');

  const heroImages = [
    "/images/hero/hero-bg.jpg", 
    "/images/hero/hero-bg2.jpg",
    "/images/hero/hero-bg3.jpg"  
];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    setCurrentImage(heroImages[randomIndex]);
  }, []);

  return (
    <div className="relative bg-brand-light/30 w-full flex flex-col lg:flex-row items-center pt-24 pb-12 lg:min-h-[90vh] lg:pt-0">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-light blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-center">
          
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-slate-900 leading-[1.1]">
              Defining the <br/>
              <span className="italic text-brand-DEFAULT">art of memory.</span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-600 font-light max-w-md mx-auto lg:mx-0 leading-relaxed">
              Fragrances crafted to linger in the mind. A minimal approach to maximum allure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
              <Link to="/shop" className="px-8 py-3 bg-slate-900 text-white text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-brand-DEFAULT transition-colors duration-500 rounded-sm">
                Shop Collection
              </Link>
            </div>
          </div>

          <div className="relative h-[40vh] lg:h-[80vh] w-full order-1 lg:order-2 mt-8 lg:mt-0">
            
            <div className="absolute inset-0 rounded-md overflow-hidden shadow-xl z-10 bg-slate-200">
               {currentImage && (
                 <img 
                   src={currentImage} 
                   alt="Luxury Perfume Display" 
                   className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-1000 ease-out animate-fade-in"
                 />
               )}
            </div>

            <div className="absolute -bottom-6 -left-4 md:-bottom-8 md:-left-8 bg-white p-4 lg:p-6 shadow-2xl hidden md:block max-w-[200px] lg:max-w-xs rounded-sm z-20 border border-slate-50">
                <p className="font-serif text-lg lg:text-xl italic text-slate-800 leading-tight">"The scent that stops time."</p>
                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">— Vogue Feature</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;