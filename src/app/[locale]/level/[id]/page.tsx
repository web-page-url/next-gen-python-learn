import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PyLingo from '@/components/PyLingo'
import { levels } from '@/components/levels'
import { generateLevelMetadata, generateBreadcrumbStructuredData } from '@/lib/seo'


export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params
  const levelId = parseInt(id)
  const resolvedLocale = locale === 'es' ? 'es-ES' : 'en-US'
  
  if (isNaN(levelId) || !levels.find(l => l.id === levelId)) {
    return {
      title: 'Level Not Found | LearnPy',
      description: 'The requested Python lesson could not be found.',
    }
  }

  return generateLevelMetadata(levelId, resolvedLocale)
}

export async function generateStaticParams() {
  const locales = ['en', 'es']
  const params = []
  
  for (const locale of locales) {
    for (const level of levels) {
      params.push({
        locale,
        id: level.id.toString(),
      })
    }
  }
  
  return params
}

export default async function LocaleLevelPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  const levelId = parseInt(id)
  
  if (isNaN(levelId) || !levels.find(l => l.id === levelId)) {
    notFound()
  }

  const breadcrumbData = generateBreadcrumbStructuredData(levelId)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
      <PyLingo initialLevel={levelId} />
    </>
  )
}
