import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, "messages"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(list);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div className="p-8 text-sm text-slate-500">Loading Messages...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-serif text-3xl text-slate-900 mb-8">Contact Messages</h1>

      {messages.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-sm border border-slate-100">
          <p className="text-slate-500">No messages received yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-6 rounded-sm shadow-sm border border-slate-100 hover:border-slate-300 transition-colors">
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 text-lg">{msg.subject}</h3>
                <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                  {msg.date?.toDate ? msg.date.toDate().toLocaleString() : 'Just now'}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-4 text-sm border-b border-slate-50 pb-3">
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="font-bold text-slate-700">{msg.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <a href={`mailto:${msg.email}`} className="text-slate-600 hover:text-brand-DEFAULT hover:underline">{msg.email}</a>
                  </div>

                  {msg.phone && (
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <a href={`tel:${msg.phone}`} className="text-slate-600 hover:text-brand-DEFAULT hover:underline">{msg.phone}</a>
                    </div>
                  )}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-sm border-l-2 border-brand-light">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;