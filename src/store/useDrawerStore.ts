import { ReactNode } from 'react'
import { create } from 'zustand'

type DrawerStore = {
  isOpen: boolean
  title?: string
  content: ReactNode | null

  openDrawer: (params: { title?: string; content: ReactNode }) => void
  closeDrawer: () => void
}

export const useDrawerStore = create<DrawerStore>((set) => ({
  isOpen: false,
  title: '',
  content: null,

  openDrawer: ({ title, content }) =>
    set({
      isOpen: true,
      title,
      content,
    }),

  closeDrawer: () =>
    set({
      isOpen: false,
      title: '',
      content: null,
    }),
}))
