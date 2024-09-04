import { AdaptableCard } from '@/components/shared'
import { injectReducer } from '@/store'
import ConfigTable from './components/ConfigTable'
import reducer from './store'

injectReducer('configFee', reducer)

const ConfigList = () => {
  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="lg:flex items-center justify-between mb-4">
        <h3 className="mb-4 lg:mb-0">Configs Fee (Default)</h3>
      </div>
      <ConfigTable />
    </AdaptableCard>
  )
}

export default ConfigList
