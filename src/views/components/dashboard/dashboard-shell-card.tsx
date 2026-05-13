import type { ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/views/components/ui/card"

type DashboardShellCardProps = {
  title: string
  subtitle?: string
  className?: string
  children: ReactNode
}

export function DashboardShellCard({
  title,
  subtitle,
  className = "",
  children,
}: DashboardShellCardProps) {
  return (
    <Card className={`gap-0 rounded-lg border border-gray-200 bg-white py-0 shadow-sm ${className}`}>
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">{title}</CardTitle>
        {subtitle ? <p className="text-xs text-slate-400">{subtitle}</p> : null}
      </CardHeader>
      <CardContent className="px-4 pb-4">{children}</CardContent>
    </Card>
  )
}
