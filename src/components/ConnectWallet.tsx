import { FC } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

type Visibility = 'always' | 'connected' | 'not_connected'

const ConnectWallet: FC<{ show?: Visibility }> = ({ show = 'always' }) => {
	const { address, connector } = useAccount()

	if ((show == 'connected' && !address) || (show == 'not_connected' && address)) return null

	return <ConnectButton chainStatus="icon" />
}

export default ConnectWallet
