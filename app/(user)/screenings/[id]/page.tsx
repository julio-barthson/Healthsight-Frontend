"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { CheckCircle2 } from "lucide-react"

import { PageHeader } from "@/components/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/store/useAuth"
import api from "@/lib/api"

type Screening = {
  id: string
  screeningNumber: string
  screeningType: string
  status: string
  doctorNotes?: string
  referralNote?: string
  completedAt?: string
  createdAt: string
  patient: { id: string; firstName: string; lastName: string; patientNumber: string; gender: string; age: number; phoneNumber?: string }
  conductedBy: { firstName: string; lastName: string }
  assessedBy?: { firstName: string; lastName: string } | null
  vitals?: any
  hypertension?: any
  diabetes?: any
  cervical?: any
  breast?: any
  psa?: any
}

const statusVariant: Record<string, any> = {
  PENDING: "secondary",
  IN_PROGRESS: "outline",
  COMPLETED: "default",
  REFERRED: "destructive",
}

const CAN_RECORD_VITALS = ["ADMIN", "NURSE", "MIDWIFE", "WARD_NURSE", "DENTAL_NURSE", "EMERGENCY_CARE_STAFF", "EMERGENCY_MEDICAL_TECHNICIAN", "MEDICAL_OFFICER", "CONSULTANT", "OBSTETRICIAN", "OPHTHALMOLOGIST", "OPTOMETRIST", "DENTIST", "COMMUNITY_HEALTH_EXTENSION_WORKER"]
const CAN_COMPLETE = ["ADMIN", "MEDICAL_OFFICER", "CONSULTANT", "OBSTETRICIAN", "OPHTHALMOLOGIST", "OPTOMETRIST", "DENTIST"]
const CAN_SCREEN_HTN = ["ADMIN", "COMMUNITY_HEALTH_EXTENSION_WORKER"]
const CAN_SCREEN_DM = ["ADMIN", "MEDICAL_LABORATORY_SCIENTIST", "MEDICAL_LABORATORY_TECHNICIAN"]
const CAN_SCREEN_CERVICAL = ["ADMIN", "NURSE", "MIDWIFE", "WARD_NURSE", "DENTAL_NURSE", "EMERGENCY_CARE_STAFF", "EMERGENCY_MEDICAL_TECHNICIAN"]
const CAN_SCREEN_BREAST = ["ADMIN", "MEDICAL_OFFICER", "CONSULTANT", "OBSTETRICIAN", "OPHTHALMOLOGIST", "OPTOMETRIST", "DENTIST"]
const CAN_SCREEN_PSA = ["ADMIN", "MEDICAL_LABORATORY_SCIENTIST", "MEDICAL_LABORATORY_TECHNICIAN"]

export default function ScreeningDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [screening, setScreening] = useState<Screening | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const userRoles = user?.roles?.map((r) => r.name) ?? []
  const canRecordVitals = userRoles.some((r) => CAN_RECORD_VITALS.includes(r))
  const canComplete = userRoles.some((r) => CAN_COMPLETE.includes(r))

  const reload = () =>
    api.get(`/screenings/${id}`).then((res) => setScreening(res.data)).catch(() => toast.error("Failed to reload"))

  useEffect(() => {
    api
      .get(`/screenings/${id}`)
      .then((res) => setScreening(res.data))
      .catch(() => toast.error("Failed to load screening"))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-64 w-full" /></div>
  if (!screening) return null

  const isDone = screening.status === "COMPLETED" || screening.status === "REFERRED"

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title={`Screening — ${screening.screeningType.replace(/_/g, " ")}`}
        description={screening.screeningNumber}
        back
      />

      {/* Summary */}
      <div className="rounded-lg border p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/patients/${screening.patient.id}`} className="font-semibold hover:underline">
              {screening.patient.firstName} {screening.patient.lastName}
            </Link>
            <p className="text-xs text-muted-foreground">{screening.patient.patientNumber} &bull; {screening.patient.age} yrs &bull; {screening.patient.gender}</p>
          </div>
          <Badge variant={statusVariant[screening.status]}>{screening.status.replace(/_/g, " ")}</Badge>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <Info label="Date" value={format(new Date(screening.createdAt), "dd MMM yyyy")} />
          <Info label="Conducted By" value={`${screening.conductedBy.firstName} ${screening.conductedBy.lastName}`} />
          {screening.assessedBy && <Info label="Assessed By" value={`${screening.assessedBy.firstName} ${screening.assessedBy.lastName}`} />}
          {screening.completedAt && <Info label="Completed" value={format(new Date(screening.completedAt), "dd MMM yyyy")} />}
        </div>
      </div>

      {/* Vitals */}
      {canRecordVitals && (
        <VitalsForm
          screening={screening}
          saving={saving === "vitals"}
          onSave={async (data) => {
            setSaving("vitals")
            try {
              await api.post("/vitals", { ...data, screeningId: id, patientId: screening.patient.id })
              toast.success("Vitals saved")
              await reload()
            } catch (err: any) {
              toast.error(err?.response?.data?.message ?? "Failed to save vitals")
            } finally { setSaving(null) }
          }}
        />
      )}

      {/* Pathway form */}
      {!isDone && (
        <PathwayForm
          screening={screening}
          userRoles={userRoles}
          saving={saving}
          setSaving={setSaving}
          onSaved={reload}
        />
      )}

      {/* Doctor assessment */}
      {canComplete && !isDone && (
        <DoctorForm
          screening={screening}
          saving={saving === "complete"}
          onComplete={async (data) => {
            setSaving("complete")
            try {
              await api.patch(`/screenings/${id}/complete`, data)
              toast.success("Screening completed")
              await reload()
            } catch (err: any) {
              toast.error(err?.response?.data?.message ?? "Failed to complete screening")
            } finally { setSaving(null) }
          }}
        />
      )}

      {/* Completed summary */}
      {isDone && (screening.doctorNotes || screening.referralNote) && (
        <div className="rounded-lg border p-5 space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Doctor Assessment
          </div>
          {screening.doctorNotes && <p className="text-sm"><span className="text-muted-foreground">Notes: </span>{screening.doctorNotes}</p>}
          {screening.referralNote && <p className="text-sm"><span className="text-muted-foreground">Referral: </span>{screening.referralNote}</p>}
        </div>
      )}
    </div>
  )
}

function VitalsForm({ screening, saving, onSave }: { screening: Screening; saving: boolean; onSave: (d: any) => void }) {
  const existing = screening.vitals
  const { register, handleSubmit } = useForm({ defaultValues: existing ?? {} })
  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Vitals</h2>
      <form onSubmit={handleSubmit(onSave)} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field label="BP Systolic (mmHg)" name="bloodPressureSystolic" register={register} type="number" />
        <Field label="BP Diastolic (mmHg)" name="bloodPressureDiastolic" register={register} type="number" />
        <Field label="Heart Rate (bpm)" name="heartRate" register={register} type="number" />
        <Field label="Weight (kg)" name="weight" register={register} type="number" step="0.1" />
        <Field label="Height (cm)" name="height" register={register} type="number" step="0.1" />
        <Field label="Temperature (°C)" name="temperature" register={register} type="number" step="0.1" />
        <Field label="SpO₂ (%)" name="oxygenSaturation" register={register} type="number" />
        <div className="col-span-2 sm:col-span-3 space-y-1.5">
          <Label>Notes</Label>
          <Textarea {...register("notes")} rows={2} />
        </div>
        <div className="col-span-2 sm:col-span-3">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : existing ? "Update Vitals" : "Record Vitals"}</Button>
        </div>
      </form>
    </div>
  )
}

function PathwayForm({ screening, userRoles, saving, setSaving, onSaved }: any) {
  const type = screening.screeningType
  const existing = screening.hypertension ?? screening.diabetes ?? screening.cervical ?? screening.breast ?? screening.psa

  if (type === "HYPERTENSION" && userRoles.some((r: string) => CAN_SCREEN_HTN.includes(r))) {
    return <HypertensionForm existing={screening.hypertension} screeningId={screening.id} saving={saving === "pathway"} setSaving={setSaving} onSaved={onSaved} />
  }
  if (type === "DIABETES" && userRoles.some((r: string) => CAN_SCREEN_DM.includes(r))) {
    return <DiabetesForm existing={screening.diabetes} screeningId={screening.id} saving={saving === "pathway"} setSaving={setSaving} onSaved={onSaved} />
  }
  if (type === "CERVICAL_CANCER" && userRoles.some((r: string) => CAN_SCREEN_CERVICAL.includes(r))) {
    return <CervicalForm existing={screening.cervical} screeningId={screening.id} saving={saving === "pathway"} setSaving={setSaving} onSaved={onSaved} />
  }
  if (type === "BREAST_CANCER" && userRoles.some((r: string) => CAN_SCREEN_BREAST.includes(r))) {
    return <BreastForm existing={screening.breast} screeningId={screening.id} saving={saving === "pathway"} setSaving={setSaving} onSaved={onSaved} />
  }
  if (type === "PSA" && userRoles.some((r: string) => CAN_SCREEN_PSA.includes(r))) {
    return <PsaForm existing={screening.psa} screeningId={screening.id} saving={saving === "pathway"} setSaving={setSaving} onSaved={onSaved} />
  }
  return null
}

function HypertensionForm({ existing, screeningId, saving, setSaving, onSaved }: any) {
  const { register, handleSubmit } = useForm({ defaultValues: existing ?? {} })
  const submit = async (data: any) => {
    setSaving("pathway")
    try {
      await api.post(`/screenings/${screeningId}/hypertension`, data)
      toast.success("Hypertension data saved")
      onSaved()
    } catch (err: any) { toast.error(err?.response?.data?.message ?? "Failed") }
    finally { setSaving(null) }
  }
  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Hypertension Screening</h2>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <BoolField label="Family History" name="familyHistory" register={register} />
          <BoolField label="Smoking" name="smokingStatus" register={register} />
          <BoolField label="Alcohol Use" name="alcoholUse" register={register} />
          <BoolField label="Previous Diagnosis" name="previousDiagnosis" register={register} />
          <BoolField label="On Medication" name="onMedication" register={register} />
        </div>
        <Field label="Physical Activity" name="physicalActivity" register={register} />
        <Field label="Salt Intake" name="saltIntake" register={register} />
        <Field label="Medication Details" name="medicationDetails" register={register} />
        <Field label="Result" name="result" register={register} />
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
      </form>
    </div>
  )
}

function DiabetesForm({ existing, screeningId, saving, setSaving, onSaved }: any) {
  const { register, handleSubmit } = useForm({ defaultValues: existing ?? {} })
  const submit = async (data: any) => {
    setSaving("pathway")
    try {
      await api.post(`/screenings/${screeningId}/diabetes`, data)
      toast.success("Diabetes data saved"); onSaved()
    } catch (err: any) { toast.error(err?.response?.data?.message ?? "Failed") }
    finally { setSaving(null) }
  }
  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Diabetes Screening</h2>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Fasting Blood Sugar (mmol/L)" name="fastingBloodSugar" register={register} type="number" step="0.1" />
          <Field label="Random Blood Sugar (mmol/L)" name="randomBloodSugar" register={register} type="number" step="0.1" />
          <Field label="HbA1c (%)" name="hba1c" register={register} type="number" step="0.1" />
          <BoolField label="Family History" name="familyHistory" register={register} />
          <BoolField label="Previous Diagnosis" name="previousDiagnosis" register={register} />
          <BoolField label="On Medication" name="onMedication" register={register} />
        </div>
        <Field label="Medication Details" name="medicationDetails" register={register} />
        <Field label="Result" name="result" register={register} />
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
      </form>
    </div>
  )
}

function CervicalForm({ existing, screeningId, saving, setSaving, onSaved }: any) {
  const { register, handleSubmit } = useForm({ defaultValues: existing ?? {} })
  const submit = async (data: any) => {
    setSaving("pathway")
    try {
      await api.post(`/screenings/${screeningId}/cervical`, data)
      toast.success("Cervical data saved"); onSaved()
    } catch (err: any) { toast.error(err?.response?.data?.message ?? "Failed") }
    finally { setSaving(null) }
  }
  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Cervical Cancer Screening</h2>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Last Pap Smear Date" name="lastPapSmearDate" register={register} type="date" />
          <Field label="Pap Smear Result" name="papSmearResult" register={register} />
          <Field label="HPV Status" name="hpvStatus" register={register} />
          <Field label="VIA Result" name="viaResult" register={register} />
          <BoolField label="Abnormal Bleeding" name="abnormalBleeding" register={register} />
          <BoolField label="Colposcopy Done" name="colposcopyDone" register={register} />
        </div>
        <Field label="Result" name="result" register={register} />
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
      </form>
    </div>
  )
}

function BreastForm({ existing, screeningId, saving, setSaving, onSaved }: any) {
  const { register, handleSubmit } = useForm({ defaultValues: existing ?? {} })
  const submit = async (data: any) => {
    setSaving("pathway")
    try {
      await api.post(`/screenings/${screeningId}/breast`, data)
      toast.success("Breast data saved"); onSaved()
    } catch (err: any) { toast.error(err?.response?.data?.message ?? "Failed") }
    finally { setSaving(null) }
  }
  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Breast Cancer Screening</h2>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <BoolField label="Self Examination" name="selfExamination" register={register} />
          <Field label="Clinical Exam Result" name="clinicalExamResult" register={register} />
          <BoolField label="Mammogram Done" name="mammogramDone" register={register} />
          <Field label="Mammogram Result" name="mammogramResult" register={register} />
          <BoolField label="Family History" name="familyHistory" register={register} />
          <BoolField label="Lump Detected" name="lumpDetected" register={register} />
        </div>
        <Field label="Result" name="result" register={register} />
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
      </form>
    </div>
  )
}

function PsaForm({ existing, screeningId, saving, setSaving, onSaved }: any) {
  const { register, handleSubmit } = useForm({ defaultValues: existing ?? {} })
  const submit = async (data: any) => {
    setSaving("pathway")
    try {
      await api.post(`/screenings/${screeningId}/psa`, data)
      toast.success("PSA data saved"); onSaved()
    } catch (err: any) { toast.error(err?.response?.data?.message ?? "Failed") }
    finally { setSaving(null) }
  }
  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">PSA Screening</h2>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="PSA Level (ng/mL)" name="psaLevel" register={register} type="number" step="0.01" />
          <BoolField label="Digital Rectal Exam" name="digitalRectalExam" register={register} />
          <Field label="DRE Result" name="dreResult" register={register} />
          <BoolField label="Family History" name="familyHistory" register={register} />
          <BoolField label="Urinary Symptoms" name="urinarySymptoms" register={register} />
        </div>
        <Field label="Result" name="result" register={register} />
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
      </form>
    </div>
  )
}

function DoctorForm({ screening, saving, onComplete }: { screening: Screening; saving: boolean; onComplete: (d: any) => void }) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: { status: "COMPLETED", doctorNotes: "", referralNote: "" },
  })
  const status = watch("status")
  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Doctor Assessment</h2>
      <form onSubmit={handleSubmit(onComplete)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Outcome</Label>
          <Select value={status} onValueChange={(v) => setValue("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="COMPLETED">Completed — No referral</SelectItem>
              <SelectItem value="REFERRED">Referred</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Doctor Notes</Label>
          <Textarea {...register("doctorNotes")} rows={3} placeholder="Clinical notes…" />
        </div>
        {status === "REFERRED" && (
          <div className="space-y-1.5">
            <Label>Referral Note</Label>
            <Textarea {...register("referralNote")} rows={2} placeholder="Referral details…" />
          </div>
        )}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Complete Screening"}</Button>
      </form>
    </div>
  )
}

function Field({ label, name, register, type = "text", step }: any) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input {...register(name)} type={type} step={step} />
    </div>
  )
}

function BoolField({ label, name, register }: any) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <Checkbox {...register(name)} id={name} />
      <Label htmlFor={name}>{label}</Label>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
