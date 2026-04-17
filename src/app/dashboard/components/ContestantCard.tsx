import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Contestant } from "../hooks/useContestants"

interface ContestantCardProps {
  contestant: Contestant
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function ContestantCard({ contestant }: ContestantCardProps) {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{contestant.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{contestant.contestantId}</p>
          </div>
          <Badge variant={getCategoryBadgeVariant(contestant.category)}>
            {contestant.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Separator />
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">No.</p>
            <p className="font-medium">{contestant.no}</p>
          </div>
          <div>
            <p className="text-muted-foreground">DOB</p>
            <p className="font-medium">{formatDate(contestant.dob)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">NIC</p>
            <p className="font-mono font-medium text-xs break-all">{contestant.nic}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Mobile Number</p>
            <p className="font-medium">{contestant.mobileNumber}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
