import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-serif text-3xl md:text-4xl text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
          <p>Last Updated: December 2025</p>

          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-2">1. Introduction</h3>
            <p>Welcome to Mira's Perfume. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-2">2. Data We Collect</h3>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-2">3. How We Use Your Data</h3>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To register you as a new customer.</li>
              <li>To process and deliver your order including: Manage payments, fees and charges; Collect and recover money owed to us.</li>
              <li>To manage our relationship with you.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-2">4. Data Security</h3>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 text-lg mb-2">5. Contact Details</h3>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
            <p className="mt-2"><strong>Mira's Perfume</strong><br/>Abeokuta, Ogun State, Nigeria.<br/>Email: hello@mirasperfume.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;