'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

type ConfirmOptions = {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

export function useUnsavedChangesGuard(
  isDirty: boolean,
  confirmFn: (options: ConfirmOptions) => Promise<'save' | 'exit' | 'cancel'>,
  onSave?: () => Promise<void>,
  setIsSaving?: (saving: boolean) => void,
) {
  const router = useRouter()
  const isNavigatingRef = useRef(false)

  // ===============================
  // Interception automatique des liens internes
  // ===============================
  useEffect(() => {
    if (!isDirty) return

    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (!link) return

      const href = link.getAttribute('href')
      if (!href) return

      // Ignore external links / hash / download
      if (href.startsWith('http') || href.startsWith('#')) return

      e.preventDefault()
      e.stopImmediatePropagation()

      const action = await confirmFn({
        title: 'Save changes?',
        description: 'You have unsaved changes. What do you want to do?',
        confirmText: 'Save and Leave',
        cancelText: 'Leave without saving',
      })

      if (action === 'cancel') return

      if (action === 'save' && onSave) {
        if (setIsSaving) setIsSaving(true)
        await onSave()
        if (setIsSaving) setIsSaving(false)
      }

      isNavigatingRef.current = true
      router.push(href)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [isDirty, confirmFn, onSave, setIsSaving, router])

  // ===============================
  // Guard manuel pour router.back, boutons ou refresh
  // ===============================
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty || isNavigatingRef.current) return

      // Chrome & Firefox affichent leur propre message
      e.preventDefault()
      e.returnValue = '' // nécessaire pour que le message apparaisse
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const guard = async (navigate: () => void | Promise<void>) => {
    if (!isDirty) {
      await navigate()
      return
    }

    const action = await confirmFn({
      title: 'Save changes?',
      description: 'You have unsaved changes. What do you want to do?',
      confirmText: 'Save & Leave',
      cancelText: 'Exit without saving',
    })

    if (action === 'cancel') return

    if (action === 'save' && onSave) {
      if (setIsSaving) setIsSaving(true)
      await onSave()
      if (setIsSaving) setIsSaving(false)
    }

    isNavigatingRef.current = true
    await navigate()
  }

  return { guard }
}
