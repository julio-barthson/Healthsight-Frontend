import type { Metadata } from "next"
import { StaffLayout } from "@/components/StaffLayout"

export const metadata: Metadata = {
  title: "Reports",
  robots: { index: false, follow: false },
}

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return <StaffLayout>{children}</StaffLayout>
}
