import { Metadata } from 'next'
import PyLingo from '@/components/PyLingo'
import { TRANSLATIONS } from '@/components/translations'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale || 'en-US'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-py-ai.vercel.app'
  
  const titles: Record<string, string> = {
    'en': 'LearnPy - Interactive Python Programming Tutorial for Beginners',
    'es': 'LearnPy - Tutorial Interactivo de Programación Python para Principiantes'
  }
  
  const descriptions: Record<string, string> = {
    'en': 'Master Python programming with our interactive, step-by-step tutorial. Learn variables, loops, functions, and more through hands-on coding exercises. Perfect for beginners with AI-powered feedback.',
    'es': 'Domina la programación Python con nuestro tutorial interactivo paso a paso. Aprende variables, bucles, funciones y más a través de ejercicios de codificación prácticos. Perfecto para principiantes con retroalimentación impulsada por IA.'
  }

  const lang = locale.split('-')[0]
  const title = titles[lang] || titles['en']
  const description = descriptions[lang] || descriptions['en']

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      locale: locale.replace('-', '_'),
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'x-default': baseUrl,
      },
    },
  }
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
  ]
}

export default function LocalePage({ params }: Props) {
  return <PyLingo />
}
