import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', 
    subject: 'Order Status',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        date: new Date(),
        read: false
      });
      setStatus('Message Sent! We will reply shortly.');
      setFormData({ name: '', email: '', phone: '', subject: 'Order Status', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('Error sending message. Please try WhatsApp.');
    }
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-slate-500 font-light max-w-lg mx-auto">
            Have a question about a scent or need help with your order? 
            Our concierge team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          <div className="space-y-10">
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl text-slate-900 mb-2">Customer Care</h3>
                <p className="text-slate-500 font-light">Monday – Saturday: 9am – 6pm</p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-slate-900 mb-2">Store Location</h3>
                <p className="text-slate-500 font-light">
                    Hauze hostel opposite rock of ages pry school, Ijagun , Ijebu ode, Ogun state.
                </p>
              </div>
            </div>

            <a 
              href="https://wa.me/2349020184254" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 text-sm font-bold uppercase tracking-[0.15em] rounded-sm hover:bg-[#20bd5a] transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Chat on WhatsApp
            </a>
          </div>

          <div className="bg-slate-50 p-8 md:p-12 rounded-sm border border-slate-100">
            <h3 className="font-serif text-2xl text-slate-900 mb-6">Send us a message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                <input required type="text" className="w-full border border-slate-200 bg-white px-4 py-3 rounded-sm focus:outline-none focus:border-brand-DEFAULT" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                    <input required type="email" className="w-full border border-slate-200 bg-white px-4 py-3 rounded-sm focus:outline-none focus:border-brand-DEFAULT" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Phone Number</label>
                    <input required type="tel" className="w-full border border-slate-200 bg-white px-4 py-3 rounded-sm focus:outline-none focus:border-brand-DEFAULT" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="080..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Subject</label>
                <select className="w-full border border-slate-200 bg-white px-4 py-3 rounded-sm focus:outline-none focus:border-brand-DEFAULT"
                  value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                  <option>Order Status</option>
                  <option>Shipping Inquiry</option>
                  <option>Product Availability</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Message</label>
                <textarea required rows="4" className="w-full border border-slate-200 bg-white px-4 py-3 rounded-sm focus:outline-none focus:border-brand-DEFAULT"
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>

              <button className="w-full bg-slate-900 text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-brand-DEFAULT transition-colors rounded-sm">
                {status || "Send Message"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;