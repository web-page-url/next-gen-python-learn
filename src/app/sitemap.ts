import { MetadataRoute } from 'next'
import { levels } from '@/components/levels'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-py-ai.vercel.app'
  
  // Base pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ]

  // Add level pages
  levels.forEach((level) => {
    routes.push({
      url: `${baseUrl}/level/${level.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  })

  return routes
}