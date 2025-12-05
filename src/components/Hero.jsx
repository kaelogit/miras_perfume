import React from 'react';

const Hero = () => {
  return (
    <div className="relative bg-brand-light/30 w-full flex flex-col lg:flex-row items-center pt-24 pb-12 lg:min-h-[90vh] lg:pt-0">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-light blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left: Typography (TEXT FIXED FOR MOBILE) */}
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-slate-900 leading-[1.1]">
              Defining the <br/>
              <span className="italic text-brand-DEFAULT">art of memory.</span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-600 font-light max-w-md mx-auto lg:mx-0 leading-relaxed">
              Fragrances crafted to linger in the mind. A minimal approach to maximum allure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
              <button className="px-8 py-3 bg-slate-900 text-white text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-brand-DEFAULT transition-colors duration-500 rounded-sm">
                Shop Collection
              </button>
            </div>
          </div>

          {/* Right: The Visual (IMAGE FIXED FOR MOBILE) */}
          {/* Mobile: shorter height (40vh). Desktop: taller (80vh) */}
          <div className="relative h-[40vh] lg:h-[80vh] w-full rounded-md overflow-hidden shadow-xl order-1 lg:order-2">
            <div className="absolute inset-0 bg-slate-200">
               <img 
                 src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop" 
                 alt="Minimalist Perfume Bottle" 
                 className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 ease-out"
               />
            </div>
            {/* Badge - Hidden on very small screens to save space */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 lg:p-6 shadow-lg hidden md:block max-w-xs rounded-sm z-20 border border-slate-50">
                <p className="font-serif text-lg lg:text-xl italic text-slate-800">"The scent that stops time."</p>
                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">— Vogue Feature</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;