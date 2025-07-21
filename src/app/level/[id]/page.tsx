import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PyLingo from '@/components/PyLingo'
import { levels } from '@/components/levels'
import { generateLevelMetadata, generateBreadcrumbStructuredData } from '@/lib/seo'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const levelId = parseInt(id)
  
  if (isNaN(levelId) || !levels.find(l => l.id === levelId)) {
    return {
      title: 'Level Not Found | LearnPy',
      description: 'The requested Python lesson could not be found.',
    }
  }

  return generateLevelMetadata(levelId)
}

export async function generateStaticParams() {
  return levels.map((level) => ({
    id: level.id.toString(),
  }))
}

export default async function LevelPage({ params }: Props) {
  const { id } = await params
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
