// ContestantsTable.tsx
// shadcn/ui: Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Input
// lucide-react: Search, Filter, ChevronLeft, ChevronRight
// Mobile: card-based layout; Desktop: full table

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Contestant {
  sno: string | number;
  name: string;
  id: string;
  category: string;
  dateOfBirth: string;
  contactNo: string;
  nicNumber: string;
}

interface ContestantsTableProps {
  contestants?: Contestant[];
  totalRecords?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

// ─── Mock data (placeholder rows) ────────────────────────────────────────────

const MOCK_ROWS: Contestant[] = Array.from({ length: 9 }, (_, i) => ({
  sno: `${i + 1}`.padStart(2, "0"),
  name: "Contestant's Name",
  id: "Contestant's ID",
  category: "Category",
  dateOfBirth: "Date Of Birth",
  contactNo: "Contact No",
  nicNumber: "NIC Number",
}));

// ─── Mobile Card ─────────────────────────────────────────────────────────────

function ContestantCard({ c }: { c: Contestant }) {
  return (
    <div className="border border-gray-200 rounded-2xl px-4 py-4 bg-white">
      <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-700">
        <span className="font-medium text-gray-500">Sno.</span>
        <span>{c.sno}</span>
        <span className="font-medium text-gray-500">Name</span>
        <span>{c.name}</span>
        <span className="font-medium text-gray-500">ID</span>
        <span>{c.id}</span>
        <span className="font-medium text-gray-500">Date Of Birth</span>
        <span>{c.dateOfBirth}</span>
        <span className="font-medium text-gray-500">Category</span>
        <span>{c.category}</span>
        <span className="font-medium text-gray-500">Contact No</span>
        <span>{c.contactNo}</span>
        <span className="font-medium text-gray-500">NIC Number</span>
        <span>{c.nicNumber}</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContestantsTable({
  contestants = MOCK_ROWS,
  totalRecords = 20,
  currentPage = 1,
  totalPages = 4,
  onPageChange,
  onSearch,
  onFilter,
}: ContestantsTableProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Search + Filter bar ── */}
      <div className="flex items-center gap-3 px-4 md:px-0">
        {/* Search */}
        <div className="flex items-center flex-1 gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <Input
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search Contestant By ID / NAME / NIC"
            className="border-0 p-0 h-auto text-sm text-gray-600 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          />
        </div>

        {/* Filter pill */}
        <button
          onClick={onFilter}
          className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium">ALL</span>
        </button>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden md:block border border-gray-200 rounded-xl overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-white hover:bg-white">
              <TableHead className="text-xs font-semibold text-gray-500 py-3 pl-5">Sno.</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 py-3">Contestant's Name</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 py-3">Contestant's ID</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 py-3">Category</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 py-3">Date Of Birth</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 py-3">Contact No</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 py-3 pr-5">NIC Number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contestants.map((c, idx) => (
              <TableRow
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
              >
                <TableCell className="text-sm text-gray-600 py-3.5 pl-5">{c.sno}</TableCell>
                <TableCell className="text-sm text-gray-700 py-3.5">{c.name}</TableCell>
                <TableCell className="text-sm text-gray-600 py-3.5">{c.id}</TableCell>
                <TableCell className="text-sm text-gray-600 py-3.5">{c.category}</TableCell>
                <TableCell className="text-sm text-gray-600 py-3.5">{c.dateOfBirth}</TableCell>
                <TableCell className="text-sm text-gray-600 py-3.5">{c.contactNo}</TableCell>
                <TableCell className="text-sm text-gray-600 py-3.5 pr-5">{c.nicNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="flex md:hidden flex-col gap-3 px-4">
        {contestants.map((c, idx) => (
          <ContestantCard key={idx} c={c} />
        ))}
      </div>

      {/* ── Pagination row ── */}
      <div className="flex items-center justify-between px-4 md:px-1 pb-2">
        <p className="text-xs text-gray-500">
          Showing {String(contestants.length).padStart(2, "0")} from {totalRecords} records
        </p>

        {/* Page buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange?.(p)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                p === currentPage
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}