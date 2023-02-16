const { ethers, network } = require("hardhat");
const fs = require("fs");

const frontEndContractsFile = "../frontend/constants/networkMapping.json";
const frontEndAbiLocation = "../frontend/constants/";

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    await updateContractAddresses();
    await updateAbi();
  }
};

async function updateAbi() {
  const tip = await ethers.getContract("TIP");
  fs.writeFileSync(
    `${frontEndAbiLocation}TIP.json`,
    tip.interface.format(ethers.utils.FormatTypes.json)
  );
  const basicNft = await ethers.getContract("TIP");
  fs.writeFileSync(
    `${frontEndAbiLocation}TIP.json`,
    basicNft.interface.format(ethers.utils.FormatTypes.json)
  );
}
async function updateContractAddresses() {
  const tip = await ethers.getContract("TIP");
  const chainId = network.config.chainId?.toString();
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  );
  if (chainId in contractAddresses) {
    if (!contractAddresses[chainId]["TIP"].includes(tip.address)) {
      contractAddresses[chainId]["TIP"].push(tip.address);
    }
  } else {
    contractAddresses[chainId] = { TIP: [tip.address] };
  }

  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];

// command to update the deployed address on frontend  :
// hh deploy --network localhost --tags frontend
