import React, { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Submitter {
  id: string;
  name: string;
}

interface Props {
  submitterId: string;
  submitters: Submitter[];
  onChange: (val: string) => void;
}

export const SubmitterSelection = memo(function SubmitterSelection({
  submitterId,
  submitters,
  onChange
}: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Submitter</label>
      <Select value={submitterId} onValueChange={onChange} required>
        <SelectTrigger className="w-full h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-white focus:ring-white/20">
          <SelectValue placeholder="Select Contestant">
            {submitterId ? submitters.find(s => s.id === submitterId)?.name : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl text-white shadow-xl">
          {submitters.length > 0 ? (
            submitters.map(s => (
              <SelectItem key={s.id} value={s.id} className="focus:bg-white/10 focus:text-white py-3">{s.name}</SelectItem>
            ))
          ) : (
            <div className="p-4 text-sm text-zinc-500 text-center">No contestants found for this category.</div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
});
