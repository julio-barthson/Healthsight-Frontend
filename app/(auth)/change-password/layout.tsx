import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Change password",
  description: "Set a new password for your Healthsight account.",
  // Sensitive flow (carries an email query param) — keep out of search indexes.
  robots: { index: false, follow: false },
}

export default function ChangePasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
