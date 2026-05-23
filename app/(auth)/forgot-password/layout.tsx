import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset password",
  description:
    "Reset your Healthsight password to regain access to the Lagos State Health District I platform.",
  alternates: { canonical: "/forgot-password" },
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
