'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Props = {
  initialSearch?: string
  initialCategory?: string
  initialStatus?: string
}

export default function CategoriesToolbar({
  initialSearch = '',
  initialCategory = '',
  initialStatus = '',
}: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const panelRef = useRef<HTMLDivElement>(null)

  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)
  const [status, setStatus] = useState(initialStatus)
  const [open, setOpen] = useState(false)

  /** 🔁 URL sync */
  const updateRoute = (updates: { search?: string; category?: string; status?: string }) => {
    const query = new URLSearchParams(params.toString())
    query.set('page', '1')

    if (updates.search !== undefined) {
      if (updates.search) {
        query.set('search', updates.search)
      } else {
        query.delete('search')
      }
    }

    if (updates.category !== undefined) {
      if (updates.category) {
        query.set('category', updates.category)
      } else {
        query.delete('category')
      }
    }

    if (updates.status !== undefined) {
      if (updates.status) {
        query.set('status', updates.status)
      } else {
        query.delete('status')
      }
    }

    router.push(`/dashboard/categories?${query.toString()}`)
  }

  /**Close on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="flex items-center justify-between gap-4">
      {/* SEARCH */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            updateRoute({ search: e.target.value })
          }}
          placeholder="Search by title"
          className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
        />
      </div>

      {/* FILTER BUTTON + POPOVER */}
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>

        {open && (
          <div
            ref={panelRef}
            className="absolute right-0 z-50 mt-2 w-64 rounded-md border bg-background p-4 shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">Filters</span>
              <button onClick={() => setOpen(false)}>
                <X size={14} />
              </button>
            </div>

            {/* CATEGORY */}
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  updateRoute({ category: e.target.value })
                }}
                className="w-full rounded-md border px-2 py-1.5 text-sm"
              >
                <option value="">All</option>
                <option value="clothing">Clothing</option>
                <option value="electronics">Electronics</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  updateRoute({ status: e.target.value })
                }}
                className="w-full rounded-md border px-2 py-1.5 text-sm"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
