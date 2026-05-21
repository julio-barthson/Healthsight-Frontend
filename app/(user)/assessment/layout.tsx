import type { Metadata } from "next"
import { StaffLayout } from "@/components/StaffLayout"

export const metadata: Metadata = {
  title: "Assessments",
  robots: { index: false, follow: false },
}

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <StaffLayout>{children}</StaffLayout>
}
