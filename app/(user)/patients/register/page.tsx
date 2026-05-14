"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from "@/lib/api"

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  age: z.coerce.number().int().min(0).max(150),
  gender: z.enum(["MALE", "FEMALE"]),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  nextOfKin: z.string().optional(),
  nextOfKinPhone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function RegisterPatientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) as any })

  const gender = watch("gender")

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await api.post("/patients", data)
      toast.success(`Patient registered: ${res.data.patientNumber}`)
      router.push(`/patients/${res.data.id}`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Register Patient" back />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Personal Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>First Name *</Label>
              <Input {...register("firstName")} placeholder="e.g. Amina" />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Last Name *</Label>
              <Input {...register("lastName")} placeholder="e.g. Bello" />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Age *</Label>
              <Input {...register("age")} type="number" min={0} max={150} placeholder="e.g. 35" />
              {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Gender *</Label>
              <Select onValueChange={(v) => setValue("gender", v as "MALE" | "FEMALE")} value={gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Phone Number</Label>
            <Input {...register("phoneNumber")} placeholder="e.g. 08012345678" />
          </div>

          <div className="space-y-1.5">
            <Label>Address</Label>
            <Textarea {...register("address")} placeholder="Patient's home address" rows={2} />
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Next of Kin
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Next of Kin Name</Label>
              <Input {...register("nextOfKin")} placeholder="Full name" />
            </div>
            <div className="space-y-1.5">
              <Label>Next of Kin Phone</Label>
              <Input {...register("nextOfKinPhone")} placeholder="Phone number" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Registering…" : "Register Patient"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
