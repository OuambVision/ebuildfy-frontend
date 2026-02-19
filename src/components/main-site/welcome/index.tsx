import { Code2, Download, Globe, Smile } from 'lucide-react'
import Image from 'next/image'

export default function Welcome() {
  const features = [
    {
      title: 'Aucun téléchargement',
      icon: Download,
    },
    {
      title: 'Pas de code',
      icon: Code2,
    },
    {
      title: 'Tout dans le navigateur',
      icon: Globe,
    },
    {
      title: 'Convivial',
      icon: Smile,
    },
  ]
  return (
    <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-32 flex flex-col items-center text-center gap-6">
      <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold max-w-6xl">
        Le créateur de boutiques en ligne alimenté par l&apos;IA qui transforme vos idées en
        réalité.
      </h1>
      <p className="text-sm sm:text-base md:text-lg max-w-3xl text-gray-600">
        Avec Ebuildfy, lancez votre boutique en quelques minutes et commencez à vendre dès
        aujourd&apos;hui !
      </p>
      <div className="relative w-full h-64 md:h-[384px] mt-10">
        {/* This img will be replace by a demo frame video */}
        <Image
          src="/template1/img/hero/bf1.png"
          alt="Welcome to Ebuildfy"
          fill
          className="object-contain"
        />
      </div>
      <div className="flex flex-wrap gap-6 items-center justify-between w-full max-w-6xl">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center gap-2 p-4 rounded-lg">
            <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-main-500" />
            <h2 className="font-medium text-sm md:text-base">{feature.title}</h2>
          </div>
        ))}
      </div>
    </section>
  )
}
