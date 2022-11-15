## Airdrop NFTs to Holders

Here we use the thirdweb's node sdk to create a script for getting all owners and creating a csv file. This csv file can later be used to airdrop edition NFTs to all owners.

## Setup

To run the project, first clone this repository:

```bash
npx thirdweb@latest create --template airdrop-nfts-to-holders
```

Modify the [airdrop.mjs](./scripts/airdrop.mjs) file with your **smart contract address** and **network**.

When you're ready, run the script with the following command:

```bash
node scripts/airdrop.mjs
```

This will generate a new file called `nfts.csv` containing your snapshot, which you can upload to the dashboard!

## How It Works

In the script we are first getting the erc 721 collection:

```js
const sdk = new ThirdwebSDK("goerli");
const contract = await sdk.getContract(
  "0x08d4CC2968cB82153Bb70229fDb40c78fDF825e8"
);
```

Then, we are getting all the nfts:

```js
const nfts = await contract?.erc721.getAll();
```

Finally, we are creating a csv file with all owners and filtering it:

```js
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
```

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
