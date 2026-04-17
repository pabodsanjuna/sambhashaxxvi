import { useState, useMemo } from "react";

export type Contestant = {
  id: number;
  no: number;
  name: string;
  contestantId: string;
  category: string;
  dob: string;
  nic: string;
  mobileNumber: string;
};

// Mock data
const MOCK_CONTESTANTS: Contestant[] = [
  {
    id: 1,
    no: 1,
    name: "Ali Hassan",
    contestantId: "CNT-001",
    category: "Sports",
    dob: "1995-03-15",
    nic: "12345-6789123-4",
    mobileNumber: "+92-300-1234567",
  },
  {
    id: 2,
    no: 2,
    name: "Fatima Khan",
    contestantId: "CNT-002",
    category: "Arts",
    dob: "1998-07-22",
    nic: "98765-4321098-7",
    mobileNumber: "+92-301-7654321",
  },
  {
    id: 3,
    no: 3,
    name: "Ahmed Malik",
    contestantId: "CNT-003",
    category: "Technology",
    dob: "1996-11-08",
    nic: "11111-2222222-3",
    mobileNumber: "+92-302-1111111",
  },
  {
    id: 4,
    no: 4,
    name: "Zara Ahmed",
    contestantId: "CNT-004",
    category: "Music",
    dob: "1999-05-30",
    nic: "22222-3333333-4",
    mobileNumber: "+92-303-2222222",
  },
  {
    id: 5,
    no: 5,
    name: "Hassan Sheikh",
    contestantId: "CNT-005",
    category: "Sports",
    dob: "1997-09-14",
    nic: "33333-4444444-5",
    mobileNumber: "+92-304-3333333",
  },
  {
    id: 6,
    no: 6,
    name: "Amira Ali",
    contestantId: "CNT-006",
    category: "Arts",
    dob: "2000-01-20",
    nic: "44444-5555555-6",
    mobileNumber: "+92-305-4444444",
  },
  {
    id: 7,
    no: 7,
    name: "Muhammad Rashid",
    contestantId: "CNT-007",
    category: "Technology",
    dob: "1994-12-03",
    nic: "55555-6666666-7",
    mobileNumber: "+92-306-5555555",
  },
  {
    id: 8,
    no: 8,
    name: "Sara Noor",
    contestantId: "CNT-008",
    category: "Music",
    dob: "1998-06-17",
    nic: "66666-7777777-8",
    mobileNumber: "+92-307-6666666",
  },
]

export function useContestants() {
  const [contestants] = useState<Contestant[]>(MOCK_CONTESTANTS)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | "all">("all")
  const [sortColumn, setSortColumn] = useState<keyof Contestant | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const categories = useMemo(() => {
    const cats = new Set(contestants.map((c) => c.category))
    return Array.from(cats).sort()
  }, [contestants])

  const filteredAndSortedContestants = useMemo(() => {
    let filtered = contestants.filter((contestant) => {
      const matchesSearch =
        searchTerm === "" ||
        contestant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contestant.contestantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contestant.nic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contestant.mobileNumber.includes(searchTerm)

      const matchesCategory =
        filterCategory === "all" || contestant.category === filterCategory

      return matchesSearch && matchesCategory
    })

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [contestants, searchTerm, filterCategory, sortColumn, sortDirection])

  const handleSort = (column: keyof Contestant) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleResetFilters = () => {
    setSearchTerm("")
    setFilterCategory("all")
    setSortColumn(null)
    setSortDirection("asc")
  }

  return {
    contestants: filteredAndSortedContestants,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    categories,
    sortColumn,
    sortDirection,
    handleSort,
    handleResetFilters,
    totalCount: contestants.length,
    filteredCount: filteredAndSortedContestants.length,
  }
}
