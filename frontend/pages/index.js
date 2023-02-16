import Head from "next/head";
import Image from "next/image";

import { useState, useEffect, useContext } from "react";

import EthName from "../components/EthName";
import SendForm from "../components/SendForm";
import Post from "../components/Post";
import Price from "../components/Price";

import metadata from "../public/data/metadata.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import networkMapping from "../constants/networkMapping.json";
import TIPAbi from "../constants/TIP.json";

function App() {
  const { runContractFunction } = useWeb3Contract();
  const [toggleSendForm, setToggleSendForm] = useState(false);
  const [balance, setBalance] = useState("0");
  const [canPost, setCanPost] = useState(false);
  const [canComment, setCanComment] = useState(false);

  const { enableWeb3, authenticate, chainId, account, isWeb3Enabled } =
    useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "5";
  const marketplaceAddress = chainId
    ? networkMapping[chainString]?.TIP[0]
    : null;

  useEffect(() => {
    getBalance();
    console.log(chainId);
  }, [chainId, account]);

  useEffect(() => {
    if (toggleSendForm) {
      document.body.classList.add("send-form");
    } else {
      document.body.classList.remove("send-form");
    }
  }, [toggleSendForm]);

  const applyForTip = (
    <a href="#" className="get-tip--btn">
      Apply for $TIP
    </a>
  );

  const toggleForm = e => {
    e.preventDefault();
    setToggleSendForm(!toggleSendForm);
  };

  async function getData() {
    // REFER THIS

    runContractFunction({
      params: {
        abi: TIPAbi,
        contractAddress: marketplaceAddress,
        functionName: "canPost",
        params: {
          from: account,
        },
      },
      onError: error => console.log(error),
      onSuccess: data => {
        console.log(data);
      },
    });
  }

  //------------------------Contract Function-------------------------------
  async function getBalance() {
    await enableWeb3();

    if (account) {
      // get balance of current user
      runContractFunction({
        params: {
          abi: TIPAbi,
          contractAddress: marketplaceAddress,
          functionName: "balanceOf",
          params: {
            account: account,
          },
        },
        onError: error => console.log(error),
        onSuccess: data => {
          setBalance(data.toString());
        },
      });

      //check if current user can post
      runContractFunction({
        params: {
          abi: TIPAbi,
          contractAddress: marketplaceAddress,
          functionName: "canPost",
          params: {
            from: account,
          },
        },
        onError: error => console.log(error),
        onSuccess: data => {
          setCanPost(data);
        },
      });

      //check if current user can comment
      runContractFunction({
        params: {
          abi: TIPAbi,
          contractAddress: marketplaceAddress,
          functionName: "canComment",
          params: {
            from: account,
          },
        },
        onError: error => console.log(error),
        onSuccess: data => {
          setCanComment(data);
        },
      });
    } else {
      setBalance("0");
      setCanComment(false);
      setCanPost(false);
    }
  }
  //------------------------Contract Function-------------------------------
  async function sendTipTokens(recipientAddress, tokenAmount) {
    await enableWeb3();
    if (account) {
      runContractFunction({
        params: {
          abi: TIPAbi,
          contractAddress: marketplaceAddress,
          functionName: "transfer",
          params: {
            // from: account,
            to: recipientAddress,
            amount: tokenAmount,
          },
        },
        onError: error => console.log(error),
        onSuccess: data => {
          alert("Token Transferred Successfully");
        },
      });
    }
  }
  return (
    <>
      <Head>
        <title>T-I-P</title>
      </Head>

      <header>
        <h1>
          T<span>&mdash;</span>I<span>&mdash;</span>P
        </h1>

        <nav>
          {account && marketplaceAddress != null && (
            <span className="tip-balance">
              <Price base={balance} />
            </span>
          )}

          <ConnectButton className="wallet-connect--btn" chainStatus="icon" />
          {canPost ? (
            <a href="#" className="get-tip--btn">
              Post
            </a>
          ) : (
            applyForTip
          )}
          {balance > 0 && (
            <a href="#" className="get-tip--btn" onClick={toggleForm}>
              Send $TIP
            </a>
          )}
        </nav>
      </header>

      <SendForm
        account={account}
        sendTipTokens={sendTipTokens}
        getBalance={getBalance}
      />

      <main
        onClick={() => {
          setToggleSendForm(false);
        }}
      >
        {marketplaceAddress ? (
          metadata.map((data, index) => {
            return <Post data={data} key={index} canComment={canComment} />;
          })
        ) : (
          <div>
            <br />
            <br />
            <br />
            <br />
            Contract for this chain does not exists
          </div>
        )}
      </main>
    </>
  );
}

export default App;
