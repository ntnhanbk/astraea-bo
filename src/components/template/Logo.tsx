import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface LogoProps extends CommonProps {
  type?: 'full' | 'streamline'
  mode?: 'light' | 'dark'
  imgClass?: string
  logoWidth?: number | string
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
  const {
    type = 'full',
    mode = 'light',
    className,
    imgClass,
    style,
    logoWidth = 'auto',
  } = props

  return (
    <div
      className={classNames(
        'logo pt-2 text-center flex items-center gap-2',
        className,
        type === 'streamline' && 'pb-2'
      )}
      style={{
        ...style,
        ...{ width: logoWidth },
      }}
    >
      <img
        className={classNames(type === 'full' ? 'w-10' : 'w-12', imgClass)}
        src={`${LOGO_SRC_PATH}logo-${mode}-streamline.png`}
        alt={`${APP_NAME} logo`}
      />
      {type === 'full' && (
        <h4
          className={classNames(
            'text-xl font-mono',
            mode === 'dark' ? 'text-white' : 'text-black'
          )}
        >
          Astraea Vault
        </h4>
      )}
    </div>
  )
}

export default Logo
