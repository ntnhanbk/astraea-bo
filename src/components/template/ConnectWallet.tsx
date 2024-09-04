import appConfig from '@/configs/app.config'
import { isSupportedNetwork } from '@/lib/isSupportedNetwork'
import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { Chain, useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { Spinner } from '../ui'
import toastSwitchNetwork from '../ui/toast/utils/ToastSwitchNetwork'
import { ChainEnum, setWallet, useAppDispatch } from '@/store'

const ConnectWallet = () => {
  const { chain } = useNetwork()
  const { isConnected } = useAccount()
  const { switchNetworkAsync, isLoading } = useSwitchNetwork()
  const [showSwitch, setShowSwitch] = useState(false)
  const showChainRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isConnected) {
      dispatch(setWallet(undefined))
      return
    }
    if (isConnected && !isSupportedNetwork(chain?.id)) {
      toastSwitchNetwork()
      dispatch(setWallet(undefined))
      return
    }
    dispatch(
      setWallet({
        connected: true,
        chain:
          chain?.id === appConfig.chain[0].id
            ? ChainEnum.CRONOS
            : ChainEnum.POLYGON,
      })
    )
  }, [chain, isConnected])

  const onToggleSwitch = () => {
    setShowSwitch((prev) => !prev)
  }

  const handleSwitchChain = async (chain: Chain) => {
    setShowSwitch(false)
    await switchNetworkAsync?.(chain.id)
  }

  return (
    <>
      {isConnected && !isSupportedNetwork(chain?.id) ? (
        <div
          className="relative cursor-pointer min-w-[100px] flex items-center justify-center px-4 py-2 w-fit bg-[#3396ff] border border-black/[0.01] rounded-full text-white hover:bg-[#3396ff]/80 transition-all ease-in-out"
          onClick={onToggleSwitch}
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <Spinner color="white" /> Switching...
            </span>
          ) : (
            'Switch network'
          )}
          <CSSTransition
            nodeRef={showChainRef}
            timeout={400}
            in={showSwitch}
            mountOnEnter
            unmountOnExit
            classNames="showSwitch"
          >
            <div
              ref={showChainRef}
              className="absolute w-fit -bottom-14 bg-[#3396ff] border border-black/[0.01] rounded-md text-white"
            >
              <div className="flex items-center justify-center gap-2 bg-light dark:bg-dark-secondary w-20 py-2">
                <div
                  className="flex items-center justify-center border-2 dark:border-light/10 rounded-full hover:border-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSwitchChain(appConfig.chain[0])
                  }}
                >
                  <img
                    src="/img/logo/cronos.png"
                    alt="Cronos"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <div
                  className="flex items-center justify-center border-2 dark:border-light/10 rounded-full hover:border-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSwitchChain(appConfig.chain[1])
                  }}
                >
                  <img
                    src="/img/logo/polygon.png"
                    alt="Polygon"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
              </div>
            </div>
          </CSSTransition>
        </div>
      ) : (
        <w3m-button />
      )}
    </>
  )
}

export default ConnectWallet
