import React from 'react';

const Features = () => {
  const features = [
    { 
      title: "100% Original", 
      desc: "Authentic designer fragrances. Money-back guarantee.",
      icon: (
        <svg className="w-8 h-8 text-brand-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      title: "Nationwide Delivery", 
      desc: "Fast shipping to Lagos (Same Day) & Abuja.",
      icon: (
        <svg className="w-8 h-8 text-brand-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      title: "Secure Payment", 
      desc: "Pay safely via Bank Transfer or Card.",
      icon: (
        <svg className="w-8 h-8 text-brand-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
  ];

  return (
    <div className="bg-white py-12 md:py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {features.map((feature, index) => (
            <div key={index} className="pt-8 md:pt-0 px-4 group cursor-default flex flex-col items-center">
              <div className="mb-4 p-3 bg-brand-light/30 rounded-full group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              
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