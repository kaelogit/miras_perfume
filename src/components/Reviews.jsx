import React, { useState, useEffect } from 'react';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      quote: "Finally, a place in Ogun state that sells authentic perfumes. The delivery was instant and the packaging was exquisite.",
      author: "Sarah",
      location: "Lekki Phase 1"
    },
    {
      id: 2,
      quote: "I was skeptical about buying perfumes online in Nigeria, but Mira's is the real deal. My Creed Aventus is 100% original.",
      author: "Emeka Obi",
      location: "Victoria Island"
    },
    {
      id: 3,
      quote: "The customer service is unmatched. They helped me pick a gift for my wife and she absolutely loved it.",
      author: "Zainab",
      location: "Ijebu Ode"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000); 
    return () => clearInterval(interval); 
  }, [reviews.length]);

  return (
    <section className="bg-slate-900 py-24 relative overflow-hidden">
      
      <div className="absolute top-10 left-10 text-white/5 text-[20rem] font-serif leading-none opacity-50 select-none pointer-events-none">
        "
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        
        <div className="space-y-8 transition-opacity duration-500 ease-in-out">
          
          <p className="font-serif text-3xl md:text-5xl text-white leading-tight italic min-h-[160px] flex items-center justify-center">
            "{reviews[currentIndex].quote}"
          </p>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-white font-bold tracking-widest uppercase text-sm">
              {reviews[currentIndex].author}
            </span>
            <span className="text-slate-400 text-xs uppercase tracking-wider">
              Verified Buyer • {reviews[currentIndex].location}
            </span>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-white w-4"
                    : "bg-white/40 hover:bg-white/70" 
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Reviews;