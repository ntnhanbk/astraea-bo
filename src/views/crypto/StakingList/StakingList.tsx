import { AdaptableCard } from '@/components/shared'
import StakingTableTool from './components/StakingTableTool'
import StakingTable from './components/StakingTable'
import { injectReducer } from '@/store'
import reducer from './store'

injectReducer('stakingList', reducer)

const StakingList = () => {
  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="lg:flex items-center justify-between mb-4">
        <h3 className="mb-4 lg:mb-0">Staking List</h3>
        <StakingTableTool />
      </div>
      <StakingTable />
    </AdaptableCard>
  )
}

export default StakingList
