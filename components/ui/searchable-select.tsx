"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface SelectOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface SearchableSelectProps {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  loading?: boolean
  multiple?: boolean
  values?: string[]
  onValuesChange?: (values: string[]) => void
  className?: string
  clearable?: boolean
  size?: "sm" | "default" | "lg"
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "اختر خياراً...",
  searchPlaceholder = "البحث...",
  emptyText = "لا توجد نتائج",
  disabled = false,
  loading = false,
  multiple = false,
  values = [],
  onValuesChange,
  className,
  clearable = false,
  size = "default"
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  const selectedOptions = React.useMemo(() => {
    return options.filter((option) => values.includes(option.value))
  }, [options, values])

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

  const handleSelect = React.useCallback((selectedValue: string) => {
    if (multiple) {
      const newValues = values.includes(selectedValue)
        ? values.filter((v) => v !== selectedValue)
        : [...values, selectedValue]
      onValuesChange?.(newValues)
    } else {
      onValueChange?.(selectedValue === value ? "" : selectedValue)
      setOpen(false)
    }
  }, [multiple, values, value, onValueChange, onValuesChange])

  const handleClear = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple) {
      onValuesChange?.([])
    } else {
      onValueChange?.("")
    }
  }, [multiple, onValueChange, onValuesChange])

  const handleRemoveValue = React.useCallback((valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple) {
      onValuesChange?.(values.filter(v => v !== valueToRemove))
    }
  }, [multiple, values, onValuesChange])

  const sizeClasses = {
    sm: "h-8 text-xs",
    default: "h-10 text-sm",
    lg: "h-12 text-base"
  }

  const displayValue = React.useMemo(() => {
    if (multiple) {
      if (selectedOptions.length === 0) return placeholder
      if (selectedOptions.length === 1) return selectedOptions[0].label
      return `تم اختيار ${selectedOptions.length} عنصر`
    }
    return selectedOption?.label || placeholder
  }, [multiple, selectedOptions, selectedOption, placeholder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            sizeClasses[size],
            !value && !values.length && "text-muted-foreground",
            className
          )}
          disabled={disabled || loading}
        >
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                <span>جاري التحميل...</span>
              </div>
            ) : multiple && selectedOptions.length > 0 ? (
              <div className="flex items-center gap-1 flex-wrap">
                {selectedOptions.slice(0, 2).map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="text-xs px-2 py-0 h-5"
                  >
                    {option.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                      onClick={(e) => handleRemoveValue(option.value, e)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
                {selectedOptions.length > 2 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                    +{selectedOptions.length - 2}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="truncate">{displayValue}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {clearable && ((multiple && values.length > 0) || (!multiple && value)) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-[var(--radix-popover-trigger-width)] max-w-none" 
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={false} value="">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0"
            />
          </div>
          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              <div className="grid gap-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      if (!option.disabled) {
                        handleSelect(option.value)
                      }
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                      option.disabled
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-accent hover:text-accent-foreground",
                      "data-[selected]:bg-accent data-[selected]:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Check
                        className={cn(
                          "h-4 w-4",
                          (multiple 
                            ? values.includes(option.value)
                            : value === option.value
                          )
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm">{option.label}</span>
                        {option.description && (
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// مكون مبسط للاستخدام السريع
export function Select(props: Omit<SearchableSelectProps, 'multiple' | 'values' | 'onValuesChange'>) {
  return <SearchableSelect {...props} />
}

// مكون للاختيار المتعدد
export function MultiSelect(props: Omit<SearchableSelectProps, 'value' | 'onValueChange'> & { multiple: true }) {
  return <SearchableSelect {...props} multiple />
}
