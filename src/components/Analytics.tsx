'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_path: pathname + searchParams.toString(),
      })
    }
  }, [pathname, searchParams])

  // Only render in production
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
          `,
        }}
      />
    </>
  )
}

// Custom event tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    })
  }
}

export const trackLevelComplete = (levelId: number, timeSpent: number) => {
  trackEvent('level_complete', {
    level_id: levelId,
    time_spent: timeSpent,
    event_category: 'Learning',
    event_label: `Level ${levelId}`,
  })
}

export const trackCodeRun = (levelId: number, success: boolean) => {
  trackEvent('code_run', {
    level_id: levelId,
    success: success,
    event_category: 'Interaction',
    event_label: success ? 'Success' : 'Error',
  })
}

export const trackHintUsed = (levelId: number) => {
  trackEvent('hint_used', {
    level_id: levelId,
    event_category: 'Learning',
    event_label: `Level ${levelId} Hint`,
  })
}

export const trackLanguageChange = (fromLang: string, toLang: string) => {
  trackEvent('language_change', {
    from_language: fromLang,
    to_language: toLang,
    event_category: 'User Preference',
  })
}
