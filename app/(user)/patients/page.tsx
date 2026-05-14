"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { format } from "date-fns"
import { Search, UserPlus, ChevronLeft, ChevronRight } from "lucide-react"

import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/store/useAuth"
import api from "@/lib/api"

type Patient = {
  id: string
  patientNumber: string
  firstName: string
  lastName: string
  age: number
  gender: "MALE" | "FEMALE"
  phoneNumber?: string
  phc: { id: string; name: string }
  createdAt: string
  _count: { screenings: number; appointments: number }
}

const CAN_REGISTER = [
  "ADMIN",
  "HEALTH_INFORMATION_MANAGEMENT_OFFICER",
  "HEALTH_INFORMATION_MANAGEMENT_TECHNICIAN",
  "MEDICAL_OFFICER",
  "CONSULTANT",
  "OBSTETRICIAN",
  "OPHTHALMOLOGIST",
  "OPTOMETRIST",
  "DENTIST",
]

export default function PatientsPage() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const canRegister = user?.roles?.some((r) => CAN_REGISTER.includes(r.name))

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, limit: 20 }
      if (search) params.search = search
      const res = await api.get("/patients", { params })
      setPatients(res.data.data)
      setTotal(res.data.total)
      setTotalPages(res.data.totalPages)
    } catch {
      toast.error("Failed to load patients")
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    const t = setTimeout(fetchPatients, search ? 400 : 0)
    return () => clearTimeout(t)
  }, [fetchPatients, search])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description={`${total} patient${total !== 1 ? "s" : ""} registered`}
        action={
          canRegister ? (
            <Button asChild>
              <Link href="/patients/register">
                <UserPlus className="mr-2 h-4 w-4" />
                Register Patient
              </Link>
            </Button>
          ) : undefined
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, number or phone…"
          className="pl-9"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Screenings</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? [...Array(8)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(8)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : patients.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-14 text-center text-muted-foreground">
                      No patients found.
                    </TableCell>
                  </TableRow>
                )
              : patients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.patientNumber}</TableCell>
                    <TableCell className="font-medium">
                      {p.firstName} {p.lastName}
                    </TableCell>
                    <TableCell>{p.age}</TableCell>
                    <TableCell>
                      <Badge variant={p.gender === "FEMALE" ? "secondary" : "outline"}>
                        {p.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.phoneNumber ?? "—"}</TableCell>
                    <TableCell>{p._count.screenings}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {format(new Date(p.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/patients/${p.id}`}>View</Link>
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
