import appConfig from '@/configs/app.config'

export const isSupportedNetwork = (id?: string | number | null): boolean => {
  if (!id) {
    return false
  }

  // const isHexChain = typeof id === 'string' ? id.startsWith('0x') : null
  // const chainId = isHexChain ? id : `0x${Number(id).toString(16)}`
  return appConfig.chain.some((chain) => chain.id === id)
}
