import { cn } from "@/lib/utils"
import Image from "next/image"
import React from "react"

interface LogoProps {
  className?: string
}

// The source seal is a circle on a white square (white only in the corners).
// We mask it to the inscribed circle so the white corners drop out on ANY
// background — no separate transparent asset or image tooling needed.
const sealMask =
  "radial-gradient(circle closest-side, #000 99%, transparent 100%)"

export const Logo = ({ className }: LogoProps) => {
  return (
    <Image
      src="/assets/images/logo.jpeg"
      alt="Lagos State Health District I"
      width={225}
      height={225}
      priority
      style={{
        WebkitMaskImage: sealMask,
        maskImage: sealMask,
      }}
      className={cn("aspect-square w-36 object-contain", className)}
    />
  )
}
