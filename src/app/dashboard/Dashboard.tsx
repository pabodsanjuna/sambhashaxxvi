import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "sonner"
import {
  UserPlusIcon,
  MapPinIcon,
  UploadIcon,
  DownloadIcon,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useContestants } from "./hooks/useContestants"
import { SearchFilter } from "./components/SearchFilter"
import { ContestantDataTable } from "./components/ContestantDataTable"
import { ContestantCard } from "./components/ContestantCard"

export default function ContestantDashboard() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const {
    contestants,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    categories,
    sortColumn,
    sortDirection,
    handleSort,
    handleResetFilters,
    totalCount,
    filteredCount,
  } = useContestants()

  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false)
  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null)

  const handleDownloadExcel = () => {
    // Create CSV content
    const headers = [
      "No.",
      "Contestant's Name",
      "Contestant ID",
      "Category",
      "DOB",
      "NIC",
      "Mobile Number",
    ]

    const rows = contestants.map((c) => [
      c.no,
      c.name,
      c.contestantId,
      c.category,
      c.dob,
      c.nic,
      c.mobileNumber,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `contestants_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Excel file downloaded successfully!")
  }

  const handleBulkUpload = () => {
    if (!bulkUploadFile) {
      toast.error("Please select a file to upload")
      return
    }

    // Simulate file upload
    toast.success(`File "${bulkUploadFile.name}" uploaded successfully!`)
    setBulkUploadFile(null)
    setShowBulkUploadDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage and view all contestants and their submissions
        </p>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button
          onClick={() => navigate("/add-contestant")}
          className="h-auto flex flex-col items-center justify-center gap-2 py-6 rounded-lg shadow-sm hover:shadow-md transition-all bg-black hover:bg-neutral-950 text-white"
        >
          <UserPlusIcon className="h-6 w-6" />
          <span className="text-sm font-medium">Add Contestant</span>
        </Button>

        <Button
          onClick={() => navigate("/categories")}
          className="h-auto flex flex-col items-center justify-center gap-2 py-6 rounded-lg shadow-sm hover:shadow-md transition-all bg-stone-950 hover:bg-stone-900 text-white"
        >
          <MapPinIcon className="h-6 w-6" />
          <span className="text-sm font-medium">Category Locations</span>
        </Button>

        <Button
          onClick={() => setShowBulkUploadDialog(true)}
          className="h-auto flex flex-col items-center justify-center gap-2 py-6 rounded-lg shadow-sm hover:shadow-md transition-all bg-zinc-950 hover:bg-zinc-900 text-white"
        >
          <UploadIcon className="h-6 w-6" />
          <span className="text-sm font-medium">Bulk Upload</span>
        </Button>

        <Button
          onClick={handleDownloadExcel}
          className="h-auto flex flex-col items-center justify-center gap-2 py-6 rounded-lg shadow-sm hover:shadow-md transition-all bg-olive-950 hover:bg-olive-900 text-white"
        >
          <DownloadIcon className="h-6 w-6" />
          <span className="text-sm font-medium">Download Excel</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        categories={categories}
        onReset={handleResetFilters}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />

      {/* Data Display - Table on Desktop, Cards on Mobile */}
      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {contestants.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No contestants found.
            </div>
          ) : (
            contestants.map((contestant) => (
              <ContestantCard key={contestant.id} contestant={contestant} />
            ))
          )}
        </div>
      ) : (
        <ContestantDataTable
          contestants={contestants}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      )}

      {/* Bulk Upload Sheet */}
      <Sheet open={showBulkUploadDialog} onOpenChange={setShowBulkUploadDialog}>
        <SheetContent side="bottom" className="max-h-[90vh]">
          <SheetHeader>
            <SheetTitle>Bulk Upload Contestants</SheetTitle>
            <SheetDescription>
              Upload a CSV file with contestant information. Ensure the file has the correct
              format with columns: Name, Contestant ID, Category, DOB, NIC, Mobile Number.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 py-6">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">CSV file only</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={(e) => setBulkUploadFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            {bulkUploadFile && (
              <div className="text-sm text-muted-foreground">
                Selected file: <span className="font-medium text-foreground">{bulkUploadFile.name}</span>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBulkUploadDialog(false)
                  setBulkUploadFile(null)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleBulkUpload}>Upload</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
