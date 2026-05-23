import type { Metadata } from "next"
import { StaffLayout } from "@/components/StaffLayout"

export const metadata: Metadata = {
  title: "Volunteers",
  robots: { index: false, follow: false },
}

export default function VolunteersLayout({ children }: { children: React.ReactNode }) {
  return <StaffLayout>{children}</StaffLayout>
}
