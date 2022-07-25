// yarn hardhat node

const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  // compile them in our code
  // comple them separately
  // http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  /* let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY__PASSWORD
  ); */
  wallet = await wallet.connect(provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy();
  const deploymentReceipt = await contract.deployTransaction.wait(1) // Waits 1 block
  console.log(`Contract deployed to ${contract.address}`);
  //get number

  const currentFavoriteNumber = await contract.retrieve();
  console.log(`current Favorite Number: ${currentFavoriteNumber.toString()}`);
  const transactionResponse = await contract.store("7");
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated favorite number is: ${updatedFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
