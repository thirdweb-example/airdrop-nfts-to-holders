import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import fs from "fs";
import path from "path";

(async () => {
  // TODO: Replace this with your network
  const sdk = new ThirdwebSDK("goerli");

  // TODO: Replace this with your smart contract address
  const contract = await sdk.getContract(
    "0x08d4CC2968cB82153Bb70229fDb40c78fDF825e8"
  );

  if (!contract) {
    return console.log("Contract not found");
  }

  const nfts = await contract?.erc721.getAll();

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
