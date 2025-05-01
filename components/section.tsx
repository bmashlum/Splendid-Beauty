import type React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  id: string
  children: React.ReactNode
  className?: string
}

export default function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("min-h-screen flex flex-col items-center justify-center px-6 py-24", className)}>
      {children}
    </section>
  )
}
