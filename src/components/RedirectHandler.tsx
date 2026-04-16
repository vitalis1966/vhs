import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function RedirectHandler() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { data: redirects } = useQuery({
    queryKey: ['seo-redirects'],
    queryFn: async () => {
      const { data } = await supabase
        .from('seo_redirects')
        .select('from_path, to_path, redirect_type')
        .eq('is_active', true)
      return data || []
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })

  useEffect(() => {
    if (!redirects) return
    const match = redirects.find(r => r.from_path === pathname)
    if (match) {
      if (match.to_path.startsWith('http')) {
        window.location.href = match.to_path
      } else {
        navigate(match.to_path, { replace: match.redirect_type === 301 })
      }
    }
  }, [pathname, redirects, navigate])

  return null
}
