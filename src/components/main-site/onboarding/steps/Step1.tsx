// app/onboarding/components/Step1.tsx
'use client'

import { CheckCircle } from 'lucide-react'

export default function Step1({ router }: { router: any }) {
  const steps = [
    'Donner un nom à votre boutique',
    'Choisir un modèle pour votre boutique',
    'Configurer le domaine ou sous-domaine',
    'Configurer le paiement pour vos clients',
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold mb-2">Bienvenue sur eBuildfy !</h2>
        <p>
          Avant de commencer à vendre, prenez une minute pour configurer les éléments essentiels de
          votre boutique :
        </p>
      </div>

      {/* Steps list */}
      <ul className="flex flex-col gap-3 mt-4">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-main-500 mt-1" />
            <span className="text-gray-700">{step}</span>
          </li>
        ))}
      </ul>

      {/* Footer / note duration */}
      <p className="mt-6 italic">
        Cela prendra environ <span className="font-bold">une minute</span> seulement pour compléter
        ces étapes et commencer à vendre.
      </p>

      <div className="flex w-full justify-end mt-8">
        <button
          onClick={() => {
            router.push('/onboarding?step=2')
          }}
          className="px-4 py-2 bg-main-500 hover:bg-main-600 text-white rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Commencer
        </button>
      </div>
    </div>
  )
}
