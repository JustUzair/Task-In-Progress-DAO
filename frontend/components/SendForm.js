import { fetchBalance } from "@wagmi/core";
import { useState, useContext } from "react";
import Web3 from "web3";

const SendForm = function ({ account, sendTipTokens, getBalance }) {
  const [ethAddress, setEthAddress] = useState("");
  const [amount, setAmount] = useState("0");

  const sendTip = async event => {
    const web3 = new Web3(Web3.givenProvider);
    console.log(ethAddress, amount);
    if (account) {
      const cents = web3.utils.toWei(amount, "ether");
      await sendTipTokens(ethAddress, cents);
      await getBalance();
    }
  };

  return (
    <form onSubmit={sendTip}>
      <div>
        <label>Address</label>
        <input
          type="text"
          value={ethAddress}
          onChange={e => setEthAddress(e.target.value)}
          placeholder="0x"
        />
      </div>
      <div>
        <label>Amount of $TIP</label>
        <input
          type="text"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </div>
      <button
        className="send-tip--btn"
        onClick={async e => {
          e.preventDefault();
          e.target.innerHTML = "Sending Tokens...";
          await sendTip(e);
          e.target.innerHTML = "Send";
          setEthAddress("");
          setAmount("0");
        }}
      >
        Send
      </button>
    </form>
  );
};

export default SendForm;

// 0x9901f8073855D2fEC6f0E67131D62D517Ba00889
