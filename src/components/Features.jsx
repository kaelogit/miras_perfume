import React from 'react';

const Features = () => {
  const features = [
    { 
      title: "100% Original", 
      desc: "Authentic designer fragrances. Money-back guarantee." 
    },
    { 
      title: "Nationwide Delivery", 
      desc: "Fast shipping to Lagos (Same Day) & Abuja." 
    },
    { 
      title: "Secure Payment", 
      desc: "Pay safely via Bank Transfer or Card." 
    },
  ];

  return (
    // Reduced py-20 to py-12 for mobile
    <div className="bg-white py-12 md:py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {features.map((feature, index) => (
            <div key={index} className="pt-6 md:pt-0 px-4 group cursor-default">
              {/* Changed font-serif to font-sans and uppercase for cleaner look */}
              <h3 className="font-sans font-bold text-sm md:text-base tracking-widest uppercase text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 font-light text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;