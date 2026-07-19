'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import type { ProjectScreenshot } from '@/lib/types'

interface LightboxProps {
  screenshots: ProjectScreenshot[]
  currentIndex: number
  projectTitle: string
  isOpen: boolean
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function Lightbox({
  screenshots,
  currentIndex,
  projectTitle,
  isOpen,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const total = screenshots.length
  const currentScreenshot = screenshots[currentIndex]

  // Reset zoom & pan when screenshot changes
  useEffect(() => {
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }, [currentIndex, isOpen])

  const handlePrev = useCallback(() => {
    if (total <= 1) return
    onIndexChange(currentIndex === 0 ? total - 1 : currentIndex - 1)
  }, [currentIndex, total, onIndexChange])

  const handleNext = useCallback(() => {
    if (total <= 1) return
    onIndexChange(currentIndex === total - 1 ? 0 : currentIndex + 1)
  }, [currentIndex, total, onIndexChange])

  const handleZoomIn = () => {
    setZoomLevel((z) => Math.min(z + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((z) => {
      const nextZ = Math.max(z - 0.5, 1)
      if (nextZ === 1) setPanPosition({ x: 0, y: 0 })
      return nextZ
    })
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }

  // Keyboard navigation & close
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, handlePrev, handleNext])

  // Mouse pan handlers when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX - panPosition.x, y: e.clientY - panPosition.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return
    setPanPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  if (!isOpen || !currentScreenshot) return null

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md select-none"
        onClick={onClose}
      >
        {/* ── Top Header Bar ── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title & Counter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
              {projectTitle}
            </span>
            {total > 1 && (
              <span className="px-2 py-0.5 text-xs font-mono rounded bg-white/10 text-white/70">
                {currentIndex + 1} / {total}
              </span>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-1 text-white">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 rounded hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="px-2 text-xs font-mono min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-1.5 rounded hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            {zoomLevel > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1.5 rounded hover:bg-white/20 transition-colors ml-1 border-l border-white/20"
                title="Reset Zoom"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Main Viewport Area ── */}
        <div
          className="flex-1 relative flex items-center justify-center overflow-hidden p-4 sm:p-8 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 border border-white/10 backdrop-blur-sm transition-all shadow-xl"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 border border-white/10 backdrop-blur-sm transition-all shadow-xl"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Displayed Image with full aspect ratio contain & zoom/pan */}
          <motion.div
            key={`lightbox-img-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            {currentScreenshot.url ? (
              <img
                src={currentScreenshot.url}
                alt={currentScreenshot.alt || projectTitle}
                className="max-h-[82vh] max-w-[88vw] object-contain rounded-lg shadow-2xl pointer-events-none select-none"
              />
            ) : (
              <div className="text-white/60 text-sm">No image URL</div>
            )}
          </motion.div>
        </div>

        {/* Footer Hint */}
        <div className="py-2.5 text-center text-xs text-white/50 bg-black/40 border-t border-white/5">
          Use Left / Right arrow keys to navigate • Esc to close • Click zoom controls to inspect details
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
