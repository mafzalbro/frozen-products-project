import NotFoundComponent from '@/components/theme/not-found'
import { Suspense } from 'react'

export default async function NotFound() {
  return (
    <Suspense>
      
      <NotFoundComponent />
    </Suspense>
  )
}