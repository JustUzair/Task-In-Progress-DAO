import Head from "next/head";
import Image from "next/image";

import { useState, useEffect, useContext } from "react";

import EthName from "../components/EthName";
import SendForm from "../components/SendForm";
import Post from "../components/Post";
import Price from "../components/Price";

// import metadata from "../public/data/metadata.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import networkMapping from "../constants/networkMapping.json";
import TIPAbi from "../constants/TIP.json";

const metadata = [
  {
    description:
      "<p>This was a piece I'm working on which I'm not whether to go in a particular direction on...</p><p>Would love to know some thoughts on this? Especially around the grain... too much?</p>",
    author: "0xb25BF3990c5A274A758A2a3a4Cc90B3e407Eaaf4",
    image:
      "https://images.unsplash.com/photo-1619302403693-372e4ef5ec7f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=632&q=80",
    comments: 13,
  },
  {
    description:
      "<p>In my head, this came out well, but a friend of mine said it looked like I'd Photoshopped it. I'm not sure what to think now... is it too much?</p><p>I'm not sure if it's the focal length or the noise on the image that is causing that opinion... maybe both? Will tip well for constructive criticism!</p>",
    author: "0xbdA737FCa7bFbBc89ae703B4ed73b68aCf997c98",
    image:
      "https://images.unsplash.com/photo-1569346276519-709519eeaa51?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=801&q=80",
    comments: 21,
  },
  {
    description:
      "<p>Hey T-I-P squad! Would love some thoughts on this! Something I took on a trip to Scotland a few years ago and feels like it encapsulated the mood of a cold winter there!</p><p>Camera is a Nikon F6 and film was Ilford HP5 Plus (which I love btw!), I'm gonna tip 100 $TIP for my fave comment!</p>",
    author: "0xbdA737FCa7bFbBc89ae703B4ed73b68aCf997c98",
    image:
      "https://gateway.ipfs.io/ipfs/QmTQTXttE7orS5FD3K7bPxcijeW6f1hjDCkmWfg2KcYNBg/image1.jpg",
    comments: 5,
  },
  {
    description:
      "<p>I tried a double exposure on here but not fully sure if it works as a concept. Does anyone have any tips for getting better results from this technique? Argh!</p><p>Will tip generously for help! Using a cheap Leica for this fyi.</p>",
    author: "0xbdA737FCa7bFbBc89ae703B4ed73b68aCf997c98",
    image:
      "https://images.unsplash.com/photo-1583669764660-2b6aacbf9814?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1508&q=80",
    comments: 21,
  },
];
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
