import type { LucideIcon } from 'lucide-react'

export interface NavButtonViewProps {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
}
