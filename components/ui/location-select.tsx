"use client"

import * as React from "react"
import { SearchableSelect, SelectOption } from "@/components/ui/searchable-select"
import { LocationService } from "@/lib/services/mosque-service"
import { Governorate, District, SubDistrict, Neighborhood } from "@/lib/types"
import { toast } from "sonner"

interface LocationSelectProps {
  type: "governorate" | "district" | "sub-district" | "neighborhood"
  value?: string
  onValueChange?: (value: string) => void
  parentId?: number
  placeholder?: string
  disabled?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
  clearable?: boolean
  required?: boolean
}

export function LocationSelect({
  type,
  value,
  onValueChange,
  parentId,
  placeholder,
  disabled,
  className,
  size = "default",
  clearable = false,
  required = false
}: LocationSelectProps) {
  const [options, setOptions] = React.useState<SelectOption[]>([])
  const [loading, setLoading] = React.useState(false)

  const defaultPlaceholders = {
    governorate: "اختر المحافظة",
    district: "اختر المنطقة", 
    "sub-district": "اختر الناحية",
    neighborhood: "اختر الحي"
  }

  const loadOptions = React.useCallback(async () => {
    if ((type !== "governorate" && !parentId) || disabled) {
      setOptions([])
      return
    }

    try {
      setLoading(true)
      let data: any[] = []

      switch (type) {
        case "governorate":
          data = await LocationService.getGovernorates()
          break
        case "district":
          if (parentId) data = await LocationService.getDistricts(parentId)
          break
        case "sub-district":
          if (parentId) data = await LocationService.getSubDistricts(parentId)
          break
        case "neighborhood":
          if (parentId) data = await LocationService.getNeighborhoods(parentId)
          break
      }

      const selectOptions: SelectOption[] = data.map((item: Governorate | District | SubDistrict | Neighborhood) => ({
        value: item.id.toString(),
        label: item.name_ar,
        description: item.name_en
      }))

      setOptions(selectOptions)
    } catch (error) {
      console.error(`Error loading ${type}:`, error)
      toast.error(`حدث خطأ في تحميل ${defaultPlaceholders[type]}`)
      setOptions([])
    } finally {
      setLoading(false)
    }
  }, [type, parentId, disabled])

  React.useEffect(() => {
    loadOptions()
  }, [loadOptions])

  const emptyTexts = {
    governorate: "لا توجد محافظات",
    district: parentId ? "لا توجد مناطق في هذه المحافظة" : "اختر المحافظة أولاً",
    "sub-district": parentId ? "لا توجد نواحي في هذه المنطقة" : "اختر المنطقة أولاً", 
    neighborhood: parentId ? "لا توجد أحياء في هذه الناحية" : "اختر الناحية أولاً"
  }

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder || defaultPlaceholders[type] + (required ? " *" : "")}
      searchPlaceholder={`البحث في ${defaultPlaceholders[type]}...`}
      emptyText={emptyTexts[type]}
      disabled={disabled || (type !== "governorate" && !parentId)}
      loading={loading}
      className={className}
      size={size}
      clearable={clearable}
    />
  )
}

// مكونات مخصصة لكل نوع موقع
export function GovernorateSelect(props: Omit<LocationSelectProps, 'type'>) {
  return <LocationSelect {...props} type="governorate" />
}

export function DistrictSelect(props: Omit<LocationSelectProps, 'type'>) {
  return <LocationSelect {...props} type="district" />
}

export function SubDistrictSelect(props: Omit<LocationSelectProps, 'type'>) {
  return <LocationSelect {...props} type="sub-district" />
}

export function NeighborhoodSelect(props: Omit<LocationSelectProps, 'type'>) {
  return <LocationSelect {...props} type="neighborhood" />
}
