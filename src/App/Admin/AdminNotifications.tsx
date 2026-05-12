import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, CheckCircle2, Copy } from 'lucide-react';

export function AdminNotifications() {
  const [schools, setSchools] = useState<{ id: string, school_name: string }[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [adminName, setAdminName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadSchools() {
      const { data } = await supabase.from('school_details').select('id, school_name').order('school_name');
      if (data) setSchools(data);
    }
    loadSchools();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    
    setIsSending(true);
    setSuccess(false);

    const fullMessage = `${message.trim()}\n\nAdmin,\n${adminName.trim() || 'Admin Name'}\n@NCCUStudios.`;

    try {
      if (selectedSchool === 'all') {
        const payload = schools.map(s => ({
          school_details_id: s.id,
          title: title.trim(),
          message: fullMessage,
          is_read: false
        }));
        
        // chunk inserts if needed, but for small amount < 1000, 1 insert is fine
        const { error } = await supabase.from('notifications').insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('notifications').insert({
          school_details_id: selectedSchool,
          title: title.trim(),
          message: fullMessage,
          is_read: false
        });
        if (error) throw error;
      }

      setSuccess(true);
      setTitle('');
      setMessage('');
      setAdminName('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Error sending notification: " + err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Broadcast Notification</h1>
        <p className="text-zinc-400 text-sm font-medium">Send a message to one or all school coordinators.</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl relative overflow-hidden backdrop-blur-sm">
        <form onSubmit={handleSend} className="space-y-6 relative z-10">
          <div className="space-y-3">
             <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Recipient</label>
             <select 
               value={selectedSchool} 
               onChange={(e) => setSelectedSchool(e.target.value)}
               className="w-full h-14 bg-black/50 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-orange-500 appearance-none"
             >
               <option value="all">Every School (Broadcast to All)</option>
               {schools.map(s => (
                 <option key={s.id} value={s.id}>{s.school_name}</option>
               ))}
             </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
               <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Title</label>
               <input 
                 required
                 type="text" 
                 placeholder="e.g. Schedule Update"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 className="w-full h-14 bg-black/50 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-orange-500"
               />
            </div>

            <div className="space-y-3">
               <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Admin Name</label>
               <input 
                 type="text" 
                 placeholder="e.g. John Doe (Optional)"
                 value={adminName}
                 onChange={(e) => setAdminName(e.target.value)}
                 className="w-full h-14 bg-black/50 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-orange-500"
               />
            </div>
          </div>

          <div className="space-y-3">
             <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Message</label>
             <textarea 
               required
               placeholder="Enter your notification message here..."
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               rows={5}
               className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-orange-500 resize-none"
             />
             <div className="text-xs text-zinc-500 mt-2 font-mono">
               A default signature will be appended:<br/>
               Admin,<br/>
               {adminName || 'Admin Name'}<br/>
               @NCCUStudios.
             </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
             {success ? (
               <span className="text-green-500 text-sm font-bold flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5" />
                 Notification Sent!
               </span>
             ) : (
               <span /> 
             )}
             
             <button 
               type="submit" 
               disabled={isSending || !title.trim() || !message.trim()}
               className="flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50"
             >
               {isSending ? 'Sending...' : 'Send Notification'}
               <Send className="w-4 h-4" />
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
