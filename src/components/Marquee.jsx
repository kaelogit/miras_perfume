import React from 'react';

const Marquee = () => {
  const text = "100% AUTHENTIC BRANDS  •  NATIONWIDE DELIVERY (NIGERIA)  •  SAME DAY OGUN STATE SHIPPING  •  UNBEATABLE PRICES  •  ";
  
  return (
    <div className="bg-slate-900 py-3 md:py-4 overflow-hidden border-y border-slate-800">
      <div 
        className="whitespace-nowrap flex w-[200%]"
        style={{
          animation: 'scroll 10s linear infinite', 
        }}
      >
        <span className="text-white text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase mx-4">
          {text.repeat(10)}
        </span>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* Slower on desktop for readability */
        @media (min-width: 768px) {
          .whitespace-nowrap {
            animation-duration: 20s !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Marquee;