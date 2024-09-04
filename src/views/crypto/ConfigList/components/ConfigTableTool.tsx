import { Button } from '@/components/ui'
import { HiPlusCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import ConfigTableSearch from './ConfigTableSearch'

const ConfigTableTool = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center">
      <ConfigTableSearch />
      <Link
        className="block lg:inline-block md:mb-0 mb-4 ml-2"
        to="/app/staking-new"
      >
        <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
          Add Config
        </Button>
      </Link>
    </div>
  )
}

export default ConfigTableTool
