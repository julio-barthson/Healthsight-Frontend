import type { Metadata } from "next"
import { StaffLayout } from "@/components/StaffLayout"

export const metadata: Metadata = {
  title: "Appointments",
  robots: { index: false, follow: false },
}

export default function AppointmentsLayout({ children }: { children: React.ReactNode }) {
  return <StaffLayout>{children}</StaffLayout>
}
