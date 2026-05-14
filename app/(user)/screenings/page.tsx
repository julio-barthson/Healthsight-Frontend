"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { format } from "date-fns"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import api from "@/lib/api"

type Screening = {
  id: string
  screeningNumber: string
  screeningType: string
  status: string
  createdAt: string
  patient: { id: string; firstName: string; lastName: string; patientNumber: string; gender: string; age: number }
  conductedBy: { firstName: string; lastName: string }
  assessedBy?: { firstName: string; lastName: string } | null
  vitals: { id: string } | null
}

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "COMPLETED", "REFERRED"]
const TYPE_OPTIONS = ["HYPERTENSION", "DIABETES", "CERVICAL_CANCER", "BREAST_CANCER", "PSA"]

const statusVariant: Record<string, any> = {
  PENDING: "secondary",
  IN_PROGRESS: "outline",
  COMPLETED: "default",
  REFERRED: "destructive",
}

export default function ScreeningsPage() {
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, limit: 20 }
      if (search) params.search = search
      if (type) params.type = type
      if (status) params.status = status
      const res = await api.get("/screenings", { params })
      setScreenings(res.data.data)
      setTotal(res.data.total)
      setTotalPages(res.data.totalPages)
    } catch {
      toast.error("Failed to load screenings")
    } finally {
      setLoading(false)
    }
  }, [page, search, type, status])

  useEffect(() => {
    const t = setTimeout(fetch, search ? 400 : 0)
    return () => clearTimeout(t)
  }, [fetch, search])

  const reset = () => { setSearch(""); setType(""); setStatus(""); setPage(1) }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Screenings"
        description={`${total} screening${total !== 1 ? "s" : ""}`}
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by patient or screening no…"
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Select value={type} onValueChange={(v) => { setType(v === "all" ? "" : v); setPage(1) }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {TYPE_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => { setStatus(v === "all" ? "" : v); setPage(1) }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || type || status) && (
          <Button variant="ghost" size="sm" onClick={reset}>Clear</Button>
        )}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Screening No.</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vitals</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Conducted By</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? [...Array(8)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(8)].map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : screenings.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-14 text-center text-muted-foreground">
                      No screenings found.
                    </TableCell>
                  </TableRow>
                )
              : screenings.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.screeningNumber}</TableCell>
                    <TableCell>
                      <Link href={`/patients/${s.patient.id}`} className="font-medium hover:underline">
                        {s.patient.firstName} {s.patient.lastName}
                      </Link>
                      <p className="text-xs text-muted-foreground">{s.patient.patientNumber}</p>
                    </TableCell>
                    <TableCell className="text-sm">{s.screeningType.replace(/_/g, " ")}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[s.status]}>{s.status.replace(/_/g, " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      {s.vitals ? (
                        <Badge variant="outline" className="text-green-600">Done</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(s.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-xs">
                      {s.conductedBy.firstName} {s.conductedBy.lastName}
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/screenings/${s.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
