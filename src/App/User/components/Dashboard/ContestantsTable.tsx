import React, { memo } from 'react';
import { motion } from 'motion/react';

type Contestant = {
  id: string;
  name: string;
  category: string;
  dob: string;
  mobile: string;
  nic: string;
};

interface Props {
  filteredContestants: Contestant[];
  searchQuery: string;
}

export const ContestantsTable = memo(function ContestantsTable({
  filteredContestants,
  searchQuery
}: Props) {
  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
           <thead>
              <tr className="border-b border-white/5">
                 <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">ID</th>
                 <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">Name</th>
                 <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">Category</th>
                 <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">DOB</th>
                 <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">NIC</th>
                 <th className="px-8 py-4 text-right text-[10px] uppercase font-bold tracking-widest text-zinc-500">Contact</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/5 text-zinc-400 text-sm">
              {filteredContestants.length > 0 ? (
                filteredContestants.map((c, idx) => (
                  <motion.tr 
                    key={c.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                      <td className="px-8 py-5 text-white font-mono">{c.id}</td>
                      <td className="px-8 py-5 text-white font-medium">{c.name}</td>
                      <td className="px-8 py-5 italic text-zinc-500">{c.category}</td>
                      <td className="px-8 py-5 text-white font-mono">{c.dob}</td>
                      <td className="px-8 py-5">{c.nic}</td>
                      <td className="px-8 py-5 text-right font-mono text-zinc-500">{c.mobile}</td>
                  </motion.tr>
                ))
              ) : (
                <tr className="border-t border-white/5">
                  <td colSpan={6} className="px-8 py-10 text-center text-zinc-600 italic">No contestants found matching "{searchQuery}"</td>
                </tr>
              )}
           </tbody>
        </table>
      </div>

      <div className="md:hidden p-6 space-y-4">
         {filteredContestants.length > 0 ? (
           filteredContestants.map((c, idx) => (
            <motion.div 
              key={c.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="bg-white/5 rounded-2xl p-5 border border-white/5 group active:bg-white/10 transition-colors space-y-4"
            >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white tracking-tight">{c.name}</h3>
                  <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded">{c.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-zinc-600 mb-1 text-[10px] uppercase font-bold tracking-widest">Category</div>
                    <div className="text-zinc-300 italic">{c.category}</div>
                  </div>
                  <div>
                    <div className="text-zinc-600 mb-1 text-[10px] uppercase font-bold tracking-widest">Contact</div>
                    <div className="text-zinc-300 font-mono">{c.mobile}</div>
                  </div>
                  <div>
                    <div className="text-zinc-600 mb-1 text-[10px] uppercase font-bold tracking-widest">DOB</div>
                    <div className="text-zinc-300 font-mono">{c.dob}</div>
                  </div>
                  <div>
                    <div className="text-zinc-600 mb-1 text-[10px] uppercase font-bold tracking-widest">NIC</div>
                    <div className="text-zinc-300 font-mono">{c.nic}</div>
                  </div>
                </div>
            </motion.div>
           ))
         ) : (
             <div className="p-10 text-center text-zinc-600 italic">No contestants found</div>
         )}
      </div>
    </>
  );
});
