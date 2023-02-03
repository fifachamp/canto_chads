import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import { useEffect } from "react";
import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
  AvatarComponent,
} from '@rainbow-me/rainbowkit';
import { canto } from 'wagmi/chains';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Chain } from '@wagmi/core'

const CustomAvatar = ({size}) =>
  <div
    className="bg-red-500"
    style={{
      borderRadius: 999,
      height: size,
      width: size,
    }}
  />

const canto_testnet = {
  id: 740,
  name: 'Canto Testnet',
  network: 'canto-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Test Canto',
    symbol: 'tC',
  },
  rpcUrls: {
    public: { http: ['https://eth.plexnode.wtf/'] },
    default: { http: ['https://eth.plexnode.wtf/'] },
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'http://testnet-explorer.canto.neobase.one/' },
    default: { name: 'SnowTrace', url: 'http://testnet-explorer.canto.neobase.one/' },
  },
}

const { chains, provider } = configureChains(
  [canto_testnet],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'CantoChads',
  chains
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
})


function Chads({ Component, pageProps }) {
  useEffect(() => {
    if (window?.ethereum) {
      // window?.ethereum.on("accountsChanged", () => window.location.reload());
      // window?.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, [])

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider 
        chains={chains} 
        modalSize="compact"
        avatar={CustomAvatar}
        initialChain={canto_testnet}
        >
        <Component {...{...pageProps}} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default Chads
