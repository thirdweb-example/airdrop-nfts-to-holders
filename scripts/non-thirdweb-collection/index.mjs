// This file is for loading the balances of users in an NFT Collection that wasn't deployed using thirdweb.
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import abi from "./example-abi.json" assert { type: "json" };
import fs from "fs";
import path from "path";

// 1. Get the ABI of the contract from Etherscan. E.g: https://etherscan.io/address/0x25ed58c027921e14d86380ea2646e3a1b5c55a8b#code
// Replace the contents of the abi.json file with the ABI from Etherscan.

// 2. Grab the contract address from Etherscan. E.g: https://etherscan.io/address/0x25ed58c027921e14d86380ea2646e3a1b5c55a8b
// Replace the variable below with the contract address.
const contractAddress = "0x25ed58c027921E14D86380eA2646E3a1B5C55A8b";

(async () => {
  // TODO: Replace this with your network
  const sdk = new ThirdwebSDK("mainnet");

  const contract = await sdk.getContract(contractAddress, abi);

  if (!contract) {
    return console.log("Contract not found");
  }

  // By default, this only loads the first 100 NFTs.
  const nfts = await contract.erc721.getAll();

  if (!nfts) {
    return console.log("No NFTs found");
  }

  const csv = nfts?.reduce((acc, nft) => {
    const address = nft.owner;
    const quantity = acc[address] ? acc[address] + 1 : 1;
    return { ...acc, [address]: quantity };
  }, {});

  const filteredCsv = Object.keys(csv).reduce((acc, key) => {
    if (key !== "0x0000000000000000000000000000000000000000") {
      return {
        ...acc,
        [key]: csv[key],
      };
    }
    return acc;
  }, {});

  const csvString =
    "address,quantity\r" +
    Object.entries(filteredCsv)
      .map(([address, quantity]) => `${address},${quantity}`)
      .join("\r");

  fs.writeFileSync(path.join(path.dirname("."), "nfts.csv"), csvString);
  console.log("Generated nfts.csv");
})();
