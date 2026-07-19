'use client'

import React from 'react'
import { Check } from 'lucide-react'
import type { AccentColor } from '@/lib/types'

interface AccentColorPickerProps {
  value: AccentColor
  onChange: (color: AccentColor) => void
}

const ACCENT_OPTIONS: { id: AccentColor; name: string; bgStyle: string }[] = [
  { id: 'blue', name: 'Blue', bgStyle: 'oklch(0.63 0.19 251)' },
  { id: 'purple', name: 'Purple', bgStyle: 'oklch(0.60 0.22 295)' },
  { id: 'green', name: 'Green', bgStyle: 'oklch(0.62 0.18 155)' },
  { id: 'orange', name: 'Orange', bgStyle: 'oklch(0.65 0.20 45)' },
]

export function AccentColorPicker({ value = 'blue', onChange }: AccentColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-fg-subtle">
          Accent Color
        </label>
        <span className="text-xs font-medium text-foreground capitalize">{value}</span>
      </div>

      <div className="flex items-center gap-3">
        {ACCENT_OPTIONS.map((color) => {
          const isSelected = value === color.id
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onChange(color.id)}
              className={`group relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'ring-2 ring-foreground scale-105 shadow-md'
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
              style={{ background: color.bgStyle }}
              title={`Select ${color.name} accent`}
              aria-label={`Select ${color.name} accent`}
            >
              {isSelected && <Check size={16} strokeWidth={2.5} className="text-white drop-shadow" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
