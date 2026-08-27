import type { Category } from '../../../types'

export interface CategoryDropdownContainerProps {
  categories: Category[]
  value: string
  onChange: (categoryId: string) => void
}
