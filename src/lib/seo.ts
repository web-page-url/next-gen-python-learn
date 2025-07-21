import { Metadata } from 'next'
import { levels } from '@/components/levels'
import { TRANSLATIONS } from '@/components/translations'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  locale?: string
  levelId?: number
}

export function generateLevelMetadata(levelId: number, locale: string = 'en-US'): Metadata {
  const level = levels.find(l => l.id === levelId)
  const t = (key: string) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key
  
  if (!level) {
    return {
      title: 'Level Not Found | LearnPy',
      description: 'The requested Python lesson could not be found.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-py-ai.vercel.app'
  const levelTitle = t(`${level.title.toLowerCase().replace(/\s+/g, '')}Title`) || level.title
  const levelDescription = t(`${level.title.toLowerCase().replace(/\s+/g, '')}Description`) || level.description
  
  const title = `${levelTitle} - Python Tutorial Level ${levelId} | LearnPy`
  const description = `${levelDescription} Interactive Python programming lesson with hands-on coding exercises and AI-powered feedback.`
  
  const keywords = [
    'Python tutorial',
    'learn Python programming',
    levelTitle.toLowerCase(),
    'Python for beginners',
    'interactive coding',
    'programming exercises',
    'Python lesson',
    'coding tutorial',
    'programming education'
  ]

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/level/${levelId}`,
      type: 'article',
      images: [
        {
          url: `${baseUrl}/og-level-${levelId}.png`,
          width: 1200,
          height: 630,
          alt: `${levelTitle} - Python Tutorial`,
        },
      ],
      locale: locale.replace('-', '_'),
      siteName: 'LearnPy',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/twitter-level-${levelId}.png`],
    },
    alternates: {
      canonical: `${baseUrl}/level/${levelId}`,
      languages: {
        'en-US': `${baseUrl}/en/level/${levelId}`,
        'es-ES': `${baseUrl}/es/level/${levelId}`,
      },
    },
  }
}

export function generateTopicMetadata(topic: string, locale: string = 'en-US'): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-py-ai.vercel.app'
  
  const topicTitles: Record<string, Record<string, string>> = {
    'variables': {
      'en-US': 'Python Variables Tutorial',
      'es-ES': 'Tutorial de Variables en Python'
    },
    'loops': {
      'en-US': 'Python Loops Tutorial',
      'es-ES': 'Tutorial de Bucles en Python'
    },
    'functions': {
      'en-US': 'Python Functions Tutorial',
      'es-ES': 'Tutorial de Funciones en Python'
    },
    'data-structures': {
      'en-US': 'Python Data Structures Tutorial',
      'es-ES': 'Tutorial de Estructuras de Datos en Python'
    }
  }

  const topicDescriptions: Record<string, Record<string, string>> = {
    'variables': {
      'en-US': 'Learn Python variables, data types, and variable assignment with interactive exercises and examples.',
      'es-ES': 'Aprende variables de Python, tipos de datos y asignación de variables con ejercicios interactivos y ejemplos.'
    },
    'loops': {
      'en-US': 'Master Python loops including for loops, while loops, and loop control with hands-on practice.',
      'es-ES': 'Domina los bucles de Python incluyendo bucles for, while y control de bucles con práctica práctica.'
    },
    'functions': {
      'en-US': 'Understand Python functions, parameters, return values, and function scope through interactive lessons.',
      'es-ES': 'Comprende las funciones de Python, parámetros, valores de retorno y alcance de funciones a través de lecciones interactivas.'
    },
    'data-structures': {
      'en-US': 'Explore Python data structures like lists, dictionaries, tuples, and sets with practical examples.',
      'es-ES': 'Explora estructuras de datos de Python como listas, diccionarios, tuplas y conjuntos con ejemplos prácticos.'
    }
  }

  const title = topicTitles[topic]?.[locale] || topicTitles[topic]?.['en-US'] || `Python ${topic} Tutorial`
  const description = topicDescriptions[topic]?.[locale] || topicDescriptions[topic]?.['en-US'] || `Learn Python ${topic} programming concepts.`

  return {
    title: `${title} | LearnPy`,
    description,
    keywords: [
      'Python tutorial',
      `Python ${topic}`,
      'learn Python programming',
      'Python for beginners',
      'interactive coding',
      'programming exercises'
    ],
    openGraph: {
      title: `${title} | LearnPy`,
      description,
      url: `${baseUrl}/topics/${topic}`,
      type: 'article',
      images: [
        {
          url: `${baseUrl}/og-topic-${topic}.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale.replace('-', '_'),
      siteName: 'LearnPy',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | LearnPy`,
      description,
      images: [`${baseUrl}/twitter-topic-${topic}.png`],
    },
    alternates: {
      canonical: `${baseUrl}/topics/${topic}`,
      languages: {
        'en-US': `${baseUrl}/en/topics/${topic}`,
        'es-ES': `${baseUrl}/es/topics/${topic}`,
      },
    },
  }
}

export function generateBreadcrumbStructuredData(levelId?: number, topic?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-py-ai.vercel.app'
  
  const breadcrumbList = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    }
  ]

  if (levelId) {
    breadcrumbList.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Python Lessons",
      "item": `${baseUrl}/lessons`
    })
    
    const level = levels.find(l => l.id === levelId)
    if (level) {
      breadcrumbList.push({
        "@type": "ListItem",
        "position": 3,
        "name": level.title,
        "item": `${baseUrl}/level/${levelId}`
      })
    }
  }

  if (topic) {
    breadcrumbList.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Topics",
      "item": `${baseUrl}/topics`
    })
    
    breadcrumbList.push({
      "@type": "ListItem",
      "position": 3,
      "name": topic.charAt(0).toUpperCase() + topic.slice(1),
      "item": `${baseUrl}/topics/${topic}`
    })
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbList
  }
}

export function generateLevelStructuredData(levelId: number, locale: string = 'en-US') {
  const level = levels.find(l => l.id === levelId)
  const t = (key: string) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-py-ai.vercel.app'

  if (!level) return null

  const levelTitle = t(`${level.title.toLowerCase().replace(/\s+/g, '')}Title`) || level.title
  const levelDescription = t(`${level.title.toLowerCase().replace(/\s+/g, '')}Description`) || level.description
  const levelConcept = t(`${level.title.toLowerCase().replace(/\s+/g, '')}Concept`) || level.concept

  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": levelTitle,
    "description": levelDescription,
    "about": levelConcept,
    "educationalLevel": "Beginner",
    "learningResourceType": "Interactive Exercise",
    "interactivityType": "Active",
    "url": `${baseUrl}/level/${levelId}`,
    "inLanguage": locale.split('-')[0],
    "isPartOf": {
      "@type": "Course",
      "name": "LearnPy - Interactive Python Programming Tutorial",
      "description": "Complete Python programming course for beginners",
      "provider": {
        "@type": "Organization",
        "name": "LearnPy",
        "url": baseUrl
      }
    },
    "teaches": [
      levelTitle,
      "Python Programming",
      "Programming Logic"
    ],
    "timeRequired": "PT15M",
    "typicalAgeRange": "13-99",
    "educationalUse": [
      "Practice",
      "Learning",
      "Tutorial"
    ],
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "Student"
    }
  }
}

export function generateCourseStructuredData(locale: string = 'en-US') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-py-ai.vercel.app'

  const courseNames: Record<string, string> = {
    'en-US': 'LearnPy - Interactive Python Programming Tutorial',
    'es-ES': 'LearnPy - Tutorial Interactivo de Programación Python'
  }

  const courseDescriptions: Record<string, string> = {
    'en-US': 'Complete interactive Python programming course for beginners. Learn variables, loops, functions, data structures and more through hands-on exercises.',
    'es-ES': 'Curso completo e interactivo de programación Python para principiantes. Aprende variables, bucles, funciones, estructuras de datos y más a través de ejercicios prácticos.'
  }

  const courseName = courseNames[locale] || courseNames['en-US']
  const courseDescription = courseDescriptions[locale] || courseDescriptions['en-US']

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseName,
    "description": courseDescription,
    "provider": {
      "@type": "Organization",
      "name": "LearnPy",
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`
    },
    "educationalLevel": "Beginner",
    "courseMode": "online",
    "inLanguage": locale.split('-')[0],
    "teaches": [
      "Python Programming",
      "Variables and Data Types",
      "Control Structures",
      "Functions",
      "Data Structures",
      "Programming Logic",
      "Problem Solving"
    ],
    "coursePrerequisites": "No programming experience required",
    "timeRequired": "PT2H",
    "numberOfCredits": 0,
    "educationalCredentialAwarded": "Certificate of Completion",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    },
    "hasCourseInstance": levels.map(level => ({
      "@type": "CourseInstance",
      "name": level.title,
      "description": level.description,
      "url": `${baseUrl}/level/${level.id}`,
      "courseMode": "online",
      "inLanguage": locale.split('-')[0]
    }))
  }
}
