import Web3 from "web3";

import WalletConnectProvider from "@walletconnect/web3-provider";

import { useState, useEffect, createContext } from "react";

export const WalletContext = createContext();
const Wallet = function ({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const connect = async function () {
    // setAccounts(["0xUzi"]);
    if (window) {
    }
  };
  const ctx = {
    accounts,
    connect,
    isConnected,
  };

  useEffect(() => {
    if (accounts.length > 0) setIsConnected(true);
    else setIsConnected(false);
  }, [accounts]);
  return (
    <WalletContext.Provider value={ctx}>{children}</WalletContext.Provider>
  );
};

export default Wallet;
