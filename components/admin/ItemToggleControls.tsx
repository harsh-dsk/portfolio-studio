'use client'

import React from 'react'
import { Eye, EyeOff, FileText } from 'lucide-react'

interface ItemToggleControlsProps {
  isVisible?: boolean
  includeInResume?: boolean
  onToggleVisibility: (isVisible: boolean) => void
  onToggleResume: (includeInResume: boolean) => void
  className?: string
  size?: 'sm' | 'md'
}

export function ItemToggleControls({
  isVisible = true,
  includeInResume = true,
  onToggleVisibility,
  onToggleResume,
  className = '',
  size = 'md',
}: ItemToggleControlsProps) {
  const iconSize = size === 'sm' ? 13 : 14
  const paddingClass = size === 'sm' ? 'p-1' : 'p-1.5'

  return (
    <div className={`flex items-center gap-1 shrink-0 ${className}`}>
      {/* ── Website Visibility Toggle ── */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleVisibility(!isVisible)
        }}
        aria-label={isVisible ? 'Hide from website' : 'Show on website'}
        title={isVisible ? 'Website: Visible (Click to hide)' : 'Website: Hidden (Click to show)'}
        className={`${paddingClass} rounded-md transition-all duration-150 flex items-center gap-1 text-[11px] font-medium ${
          isVisible
            ? 'text-brand hover:text-brand-hover hover:bg-surface-2'
            : 'text-fg-subtle hover:text-foreground hover:bg-surface-2 opacity-60'
        }`}
      >
        {isVisible ? (
          <Eye size={iconSize} strokeWidth={2} className="shrink-0" />
        ) : (
          <EyeOff size={iconSize} strokeWidth={2} className="shrink-0" />
        )}
        <span className="hidden sm:inline">{isVisible ? 'Website' : 'Hidden'}</span>
      </button>

      {/* ── Resume Toggle ── */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleResume(!includeInResume)
        }}
        aria-label={includeInResume ? 'Exclude from resume' : 'Include in resume'}
        title={includeInResume ? 'Resume: Included (Click to exclude)' : 'Resume: Excluded (Click to include)'}
        className={`${paddingClass} rounded-md transition-all duration-150 flex items-center gap-1 text-[11px] font-medium ${
          includeInResume
            ? 'text-emerald-500 hover:text-emerald-400 hover:bg-surface-2'
            : 'text-fg-subtle hover:text-foreground hover:bg-surface-2 opacity-60 line-through'
        }`}
      >
        <FileText size={iconSize} strokeWidth={includeInResume ? 2 : 1.5} className="shrink-0" />
        <span className="hidden sm:inline">{includeInResume ? 'Resume' : 'No Resume'}</span>
      </button>
    </div>
  )
}
