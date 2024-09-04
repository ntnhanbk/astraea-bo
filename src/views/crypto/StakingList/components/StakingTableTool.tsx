import { Button } from '@/components/ui'
import { HiPlusCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import StakingTableSearch from './StakingTableSearch'

const StakingTableTool = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2">
      <StakingTableSearch />
      {/* <StakingFilter /> */}
      {/* <Link
        download
        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
        to="/data/product-list.csv"
        target="_blank"
      >
        <Button block size="sm" icon={<HiDownload />}>
          Export
        </Button>
      </Link> */}
      <Link
        className="block lg:inline-block md:mb-0 mb-4"
        to="/app/staking-new"
      >
        <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
          Add Staking
        </Button>
      </Link>
    </div>
  )
}

export default StakingTableTool
