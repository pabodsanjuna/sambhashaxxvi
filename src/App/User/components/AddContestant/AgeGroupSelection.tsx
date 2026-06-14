import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  selectedAgeGroup: string;
  availableAgeGroups: string[];
  onChange: (val: string) => void;
}

export const AgeGroupSelection = memo(function AgeGroupSelection({
  selectedAgeGroup,
  availableAgeGroups,
  onChange
}: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Age Group</label>
      <Select value={selectedAgeGroup} onValueChange={onChange} required>
        <SelectTrigger className="w-full h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-white focus:ring-white/20">
          <SelectValue placeholder="Select Age Group" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl text-white">
          {availableAgeGroups.map(group => (
            <SelectItem key={group} value={group} className="focus:bg-white/10 focus:text-white py-3">{group}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
});
