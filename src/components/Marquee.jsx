import React from 'react';

const Marquee = () => {
  // I updated the text to match what you pasted in the prompt (Ogun State)
  const text = "100% AUTHENTIC BRANDS  •  NATIONWIDE DELIVERY (NIGERIA)  •  SAME DAY OGUN STATE SHIPPING  •  UNBEATABLE PRICES  •  ";
  
  return (
    // CHANGE IS HERE: 'bg-slate-900' makes it Dark, so the White text pops.
    <div className="bg-slate-900 py-4 overflow-hidden border-y border-slate-800">
      <div className="whitespace-nowrap flex animate-scroll w-[200%]">
        <span className="text-white text-xs font-bold tracking-[0.3em] uppercase mx-4">
          {text.repeat(10)}
        </span>
      </div>
    </div>
  );
};

export default Marquee;