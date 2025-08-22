"use client"

import { SearchableSelect, SelectOption } from "@/components/ui/searchable-select"

// خيارات حالة المسجد
const statusOptions: SelectOption[] = [
  { value: "مفعل", label: "مفعل", description: "المسجد في حالة مفعلة" },
  { value: "موقوف", label: "موقوف", description: "المسجد متوقف مؤقتاً" },
  { value: "مكتمل", label: "مكتمل", description: "اكتمل العمل في المسجد" }
]

// خيارات مستوى الضرر
const damageOptions: SelectOption[] = [
  { value: "جزئي", label: "ضرر جزئي", description: "أضرار قابلة للإصلاح" },
  { value: "كامل", label: "ضرر كامل", description: "أضرار شاملة تحتاج إعادة بناء" }
]

// خيارات نوع العمل
const workTypeOptions: SelectOption[] = [
  { value: "ترميم", label: "ترميم", description: "أعمال ترميم وصيانة" },
  { value: "إعادة إعمار", label: "إعادة إعمار", description: "إعادة بناء كاملة" }
]

// خيارات الفلاتر العامة
const filterOptions = {
  all: { value: "all", label: "الكل", description: "عرض جميع العناصر" },
  active: { value: "مفعل", label: "المفعلة فقط", description: "عرض العناصر المفعلة" },
  completed: { value: "مكتمل", label: "المكتملة فقط", description: "عرض العناصر المكتملة" }
}

interface StatusSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
  clearable?: boolean
  includeAll?: boolean
}

// مكون اختيار حالة المسجد
export function StatusSelect({
  value,
  onValueChange,
  placeholder = "اختر الحالة",
  disabled,
  className,
  size = "default",
  clearable = false,
  includeAll = false
}: StatusSelectProps) {
  const options = includeAll 
    ? [filterOptions.all, ...statusOptions]
    : statusOptions

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder="البحث في الحالات..."
      emptyText="لا توجد حالات متاحة"
      disabled={disabled}
      className={className}
      size={size}
      clearable={clearable}
    />
  )
}

// مكون اختيار مستوى الضرر
export function DamageSelect({
  value,
  onValueChange,
  placeholder = "اختر مستوى الضرر",
  disabled,
  className,
  size = "default",
  clearable = false,
  includeAll = false
}: StatusSelectProps) {
  const options = includeAll 
    ? [filterOptions.all, ...damageOptions]
    : damageOptions

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder="البحث في مستويات الضرر..."
      emptyText="لا توجد مستويات ضرر متاحة"
      disabled={disabled}
      className={className}
      size={size}
      clearable={clearable}
    />
  )
}

// مكون اختيار نوع العمل (ترميم/إعادة إعمار)
export function WorkTypeSelect({
  value,
  onValueChange,
  placeholder = "اختر نوع العمل",
  disabled,
  className,
  size = "default",
  clearable = false
}: Omit<StatusSelectProps, 'includeAll'>) {
  return (
    <SearchableSelect
      options={workTypeOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder="البحث في أنواع العمل..."
      emptyText="لا توجد أنواع عمل متاحة"
      disabled={disabled}
      className={className}
      size={size}
      clearable={clearable}
    />
  )
}
// is_reconstruction


// مكون عام للفلاتر
interface FilterSelectProps extends StatusSelectProps {
  type: "status" | "damage" | "workType"
}

export function FilterSelect({ type, includeAll = true, ...props }: FilterSelectProps) {
  switch (type) {
    case "status":
      return <StatusSelect {...props} includeAll={includeAll} />
    case "damage":
      return <DamageSelect {...props} includeAll={includeAll} />
    case "workType":
      return <WorkTypeSelect {...props} />
    default:
      return null
  }
}
