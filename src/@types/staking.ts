export type SpecialFee = {
  stake: number | string
  withdraw: number | string
  claim: number | string
  addBooster: number | string
  removeBooster: number | string
}

export interface Staking {
  _id: string
  deletedAt: any
  deletedBy: any
  isDeleted: boolean
  name: string
  img: string
  address: string
  periodFinish: number
  finished: boolean
  type: string
  description: string
  externalLink: string
  stakeFee: string
  info: Info
  paused: boolean
  deposited: number
  chainId: string
  createdAt: string
  updatedAt: string
  itemRewards: any[]
  userstakings: any[]
  specialFees: SpecialFee
}

export interface Info {
  stakeCoin: string
  stakeCoinPrice: number
  stakeCoinName: number
  rewardCoin: string
  rewardCoinPrice: number
  rewardCoinName: string
  booster: string
  boosterName: string
  boosterRatio: number
  rewardRate?: number
  rewardsDuration?: number
  rewardPerTokenStored?: number
  rewardPerToken?: number
  totalReward?: number
  apr?: number
  weeks?: number
}
