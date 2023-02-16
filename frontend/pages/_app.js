import "../styles/base.css";
import "../styles/globals.css";
import Wallet from "../lib/wallet";
import react, { useEffect, useState, createContext } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, arbitrum, goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { MoralisProvider } from "react-moralis";
const WalletContext = createContext();
function MyApp({ Component, pageProps }) {
  const { chains, provider } = configureChains(
    [mainnet, polygon, arbitrum, goerli],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
  );
  const { connectors } = getDefaultWallets({
    appName: "T-I-P DAO",
    chains,
  });
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <MoralisProvider initializeOnMount={false}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} WalletContext={WalletContext} />
        </RainbowKitProvider>
      </WagmiConfig>
    </MoralisProvider>
  );
}

export default MyApp;

// import "../styles/base.css";
// import "../styles/globals.css";
// import Wallet from "../lib/wallet";
// function MyApp({ Component, pageProps }) {
//   return (
//     <Wallet>
//       <Component {...pageProps} />
//     </Wallet>
//   );
// }

// export default MyApp;
