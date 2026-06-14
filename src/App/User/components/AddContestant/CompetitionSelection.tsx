import React, { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  selectedCompetition: string;
  uniqueCompetitions: string[];
  onChange: (val: string) => void;
}

export const CompetitionSelection = memo(function CompetitionSelection({
  selectedCompetition,
  uniqueCompetitions,
  onChange
}: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Competition Name</label>
      <Select value={selectedCompetition} onValueChange={onChange} required>
        <SelectTrigger className="w-full h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-white focus:ring-white/20">
          <SelectValue placeholder="Select Competition" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl text-white max-h-[300px]">
          {uniqueCompetitions.map(name => (
            <SelectItem key={name} value={name} className="focus:bg-white/10 focus:text-white py-3">{name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
