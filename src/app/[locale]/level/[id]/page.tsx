import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PyLingo from '@/components/PyLingo'
import { levels } from '@/components/levels'
import { generateLevelMetadata, generateBreadcrumbStructuredData } from '@/lib/seo'

interface Props {
  params: { locale: string; id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const levelId = parseInt(params.id)
  const locale = params.locale === 'es' ? 'es-ES' : 'en-US'
  
  if (isNaN(levelId) || !levels.find(l => l.id === levelId)) {
    return {
      title: 'Level Not Found | LearnPy',
      description: 'The requested Python lesson could not be found.',
    }
  }

  return generateLevelMetadata(levelId, locale)
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

export default function LocaleLevelPage({ params }: Props) {
  const levelId = parseInt(params.id)
  
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
