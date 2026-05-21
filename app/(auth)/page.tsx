import React from "react"
import type { Metadata } from "next"
import { LoginForm } from "./_components/LoginForm"

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Healthsight — the Lagos State Health District I platform for staff, doctors, and administrators.",
  alternates: { canonical: "/" },
}

const Page = () => {
  return (
    <>
      {/* Atmospheric backdrop — sky radial fading into the base tint (PRD §6.2).
          Fixed + scoped to the login route so siblings are untouched. */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-[radial-gradient(125%_125%_at_85%_10%,var(--brand-sky-100)_0%,var(--bg-base)_42%,var(--bg-base)_100%)]"
      />
      <div className="flex w-full items-center justify-center">
        <LoginForm />
      </div>
    </>
  )
}

export default Page
