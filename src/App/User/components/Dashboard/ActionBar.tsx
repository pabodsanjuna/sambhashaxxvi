import React, { memo } from 'react';
import { Filter, Search, MessageCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  availableCategories: string[];
}

export const ActionBar = memo(function ActionBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  availableCategories
}: Props) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full sm:max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, Name or NIC..." 
            className="w-full h-11 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/5 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-600 focus:bg-white/10"
          />
        </div>
        <div className="relative flex-shrink-0 min-w-[200px]">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="!h-11 px-4 flex items-center justify-between gap-2 rounded-2xl bg-white/5 border border-white/5 text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-1 focus:ring-white/20 font-medium cursor-pointer w-full">
              <div className="flex items-center gap-2 truncate">
                <Filter className="w-4 h-4 flex-shrink-0" />
                <SelectValue placeholder="Filter by category" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl text-white shadow-xl max-h-[300px]">
              <SelectItem value="All" className="focus:bg-white/10 focus:text-white py-3">All Categories</SelectItem>
              {availableCategories.map(cat => (
                <SelectItem key={cat} value={cat} className="focus:bg-white/10 focus:text-white py-3">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert("WhatsApp group link will be available soon.");
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/20 shadow-lg text-sm h-11 px-5 font-bold transition-all transform active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          Join WhatsApp Group
        </a>
      </div>
    </div>
  );
});
