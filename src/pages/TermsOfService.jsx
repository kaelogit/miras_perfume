import React, { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-serif text-3xl md:text-4xl text-slate-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
          <p>Last Updated: December 2025</p>

          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-2">1. Agreement to Terms</h3>
            <p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Mira's Perfume ("we," "us" or "our"), concerning your access to and use of the website.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-2">2. Products</h3>
            <p>All products are subject to availability. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-2">3. Purchases and Payment</h3>
            <p>We accept the following forms of payment: Paystack (Visa, Mastercard, Verve). You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-2">4. Return & Refund Policy</h3>
            <p>Please review our Return Policy posted on the Site prior to making any purchases. Generally, we accept returns within 48 hours of delivery provided the item is unopened, sealed, and in original condition.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-2">5. Delivery</h3>
            <p>Delivery times are estimates and start from the date of shipping, rather than the date of order. Delivery times are to be used as a guide only and are subject to the acceptance and approval of your order.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-2">6. Contact Us</h3>
            <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:</p>
            <p className="mt-2"><strong>Mira's Perfume</strong><br/>Abeokuta, Ogun State, Nigeria.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;