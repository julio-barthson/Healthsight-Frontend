"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { Plus, Search, Trash2 } from "lucide-react"

import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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

type Divider = {
  id: string
  name: string
  phoneNumber?: string
  lga?: string
  ward?: string
  community?: string
  isActive: boolean
  notes?: string
  createdAt: string
}

export default function DividersPage() {
  const { user } = useAuth()
  const isAdmin = user?.roles?.some((r) => r.name === "ADMIN")
  const [dividers, setDividers] = useState<Divider[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Divider | null>(null)
  const [deleting, setDeleting] = useState<Divider | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, limit: 20 }
      if (search) params.search = search
      const res = await api.get("/dividers", { params })
      setDividers(res.data.data)
      setTotal(res.data.total)
    } catch {
      toast.error("Failed to load dividers")
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    const t = setTimeout(fetchData, search ? 400 : 0)
    return () => clearTimeout(t)
  }, [fetchData, search])

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await api.delete(`/dividers/${deleting.id}`)
      toast.success("Divider deleted")
      setDeleting(null)
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dividers"
        description={`${total} divider${total !== 1 ? "s" : ""} registered`}
        action={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Divider
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, community, ward…"
          className="pl-9"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>LGA</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(8)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : dividers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-14 text-center text-muted-foreground"
                >
                  No dividers found.
                </TableCell>
              </TableRow>
            ) : (
              dividers.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {d.phoneNumber ?? "—"}
                  </TableCell>
                  <TableCell>{d.lga ?? "—"}</TableCell>
                  <TableCell>{d.ward ?? "—"}</TableCell>
                  <TableCell>{d.community ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={d.isActive ? "default" : "secondary"}>
                      {d.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(d.createdAt), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditing(d)}
                      >
                        Edit
                      </Button>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => setDeleting(d)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DividerSheet
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSaved={() => {
          setShowCreate(false)
          fetchData()
        }}
      />
      {editing && (
        <DividerSheet
          open
          divider={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            fetchData()
          }}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Divider?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleting?.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function DividerSheet({
  open,
  divider,
  onClose,
  onSaved,
}: {
  open: boolean
  divider?: Divider
  onClose: () => void
  onSaved: () => void
}) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: divider?.name ?? "",
      phoneNumber: divider?.phoneNumber ?? "",
      lga: divider?.lga ?? "",
      ward: divider?.ward ?? "",
      community: divider?.community ?? "",
      notes: divider?.notes ?? "",
      isActive: divider?.isActive ?? true,
    },
  })
  const [saving, setSaving] = useState(false)

  const onSubmit = async (data: any) => {
    setSaving(true)
    try {
      if (divider) {
        await api.patch(`/dividers/${divider.id}`, data)
        toast.success("Divider updated")
      } else {
        await api.post("/dividers", data)
        toast.success("Divider added")
      }
      reset()
      onSaved()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="border-b">
          <SheetTitle>{divider ? "Edit Divider" : "Add Divider"}</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="container mt-6 space-y-4"
        >
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input {...register("name")} required />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input {...register("phoneNumber")} />
          </div>
          <div className="space-y-1.5">
            <Label>LGA</Label>
            <Input {...register("lga")} />
          </div>
          <div className="space-y-1.5">
            <Label>Ward</Label>
            <Input {...register("ward")} />
          </div>
          <div className="space-y-1.5">
            <Label>Community</Label>
            <Input {...register("community")} />
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea {...register("notes")} rows={2} />
          </div>
          {divider && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={watch("isActive")}
                onCheckedChange={(v) => setValue("isActive", !!v)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          )}
          <SheetFooter className="px-0 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
