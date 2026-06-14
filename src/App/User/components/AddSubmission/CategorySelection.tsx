import React, { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  age_group: string;
}

interface Props {
  categoryId: string;
  categories: Category[];
  selectedCategoryData: Category | undefined;
  onChange: (val: string) => void;
}

export const CategorySelection = memo(function CategorySelection({
  categoryId,
  categories,
  selectedCategoryData,
  onChange
}: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Category</label>
      <Select value={categoryId} onValueChange={onChange} required>
        <SelectTrigger className="w-full h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-white focus:ring-white/20">
          <SelectValue placeholder="Select Competition Category">
            {selectedCategoryData ? `${selectedCategoryData.name} - ${selectedCategoryData.age_group}` : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl text-white shadow-xl">
          {categories.map(c => (
            <SelectItem key={c.id} value={c.id} className="focus:bg-white/10 focus:text-white py-3">
              {c.name} - {c.age_group}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
