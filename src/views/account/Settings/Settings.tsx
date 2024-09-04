import { Loading } from '@/components/shared'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import { Suspense, lazy } from 'react'

const Password = lazy(() => import('./components/Password'))

const Settings = () => {
  return (
    <Container>
      <AdaptableCard>
        <div className="px-4 py-6">
          <Suspense
            fallback={
              <>
                <Loading loading />
              </>
            }
          >
            <Password />
          </Suspense>
        </div>
      </AdaptableCard>
    </Container>
  )
}

export default Settings
