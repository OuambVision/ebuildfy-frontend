'use client'

import i18next from 'i18next'
import Image from 'next/image'
import { useCallback, useState } from 'react'

type Lang = 'en' | 'fr'

const languages: Record<Lang, { label: string; image: string }> = {
  en: { label: 'EN', image: '/media/flags/en.svg' },
  fr: { label: 'FR', image: '/media/flags/fr.png' },
}

export default function Language() {
  const [current, setCurrent] = useState<Lang>('en')

  const toggleLanguage = useCallback(() => {
    const nextLang: Lang = current === 'en' ? 'fr' : 'en'
    setCurrent(nextLang)
    i18next.changeLanguage(nextLang)
  }, [current])

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 cursor-pointer select-none"
      aria-label="Change language"
    >
      <span className="w-5 h-5 rounded-full overflow-hidden">
        <Image
          src={languages[current].image}
          alt={languages[current].label}
          className="w-full h-full object-cover"
          width={20}
          height={20}
        />
      </span>
      <span className="text-sm font-bold">{languages[current].label}</span>
    </button>
  )
}
