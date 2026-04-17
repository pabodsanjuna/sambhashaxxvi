import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDownIcon } from "lucide-react"
import type { Contestant } from "../hooks/useContestants"

interface ContestantDataTableProps {
  contestants: Contestant[]
  onSort: (column: keyof Contestant) => void
  sortColumn: keyof Contestant | null
  sortDirection: "asc" | "desc"
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function ContestantDataTable({
  contestants,
  onSort,
  sortColumn,
  sortDirection,
}: ContestantDataTableProps) {
  const SortHeader = ({
    column,
    children,
  }: {
    column: keyof Contestant
    children: React.ReactNode
  }) => (
    <TableHead className="cursor-pointer hover:bg-muted/50">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 h-8 px-0"
        onClick={() => onSort(column)}
      >
        {children}
        {sortColumn === column && (
          <ArrowUpDownIcon
            className={`h-4 w-4 transition-transform ${
              sortDirection === "desc" ? "rotate-180" : ""
            }`}
          />
        )}
      </Button>
    </TableHead>
  )

  const getCategoryBadgeVariant = (category: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, any> = {
      "Sports": "default",
      "Arts": "secondary",
      "Technology": "outline",
      "Music": "secondary",
    }
    return variants[category] || "outline"
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortHeader column="no">No.</SortHeader>
            <SortHeader column="name">Name</SortHeader>
            <SortHeader column="contestantId">Contestant ID</SortHeader>
            <SortHeader column="category">Category</SortHeader>
            <SortHeader column="dob">DOB</SortHeader>
            <SortHeader column="nic">NIC</SortHeader>
            <SortHeader column="mobileNumber">Mobile Number</SortHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contestants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No contestants found.
              </TableCell>
            </TableRow>
          ) : (
            contestants.map((contestant) => (
              <TableRow key={contestant.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{contestant.no}</TableCell>
                <TableCell className="font-medium">{contestant.name}</TableCell>
                <TableCell className="font-mono text-sm">{contestant.contestantId}</TableCell>
                <TableCell>
                  <Badge variant={getCategoryBadgeVariant(contestant.category)}>
                    {contestant.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{formatDate(contestant.dob)}</TableCell>
                <TableCell className="font-mono text-sm">{contestant.nic}</TableCell>
                <TableCell className="text-sm">{contestant.mobileNumber}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
