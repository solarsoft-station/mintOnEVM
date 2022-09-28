// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const baseURI = process.env.BASE_URI;
  const hiddenURI = process.env.HIDDEN_URI;
  const royalties = 4500; //45% default royalties
    // We get the contract to deploy
  const mintNFT = await hre.ethers.getContractFactory("test");
  const nft = await mintNFT.deploy(hiddenURI, baseURI, royalties);

  await nft.deployed();

  console.log("testNFTContract deployed to:", nft.address);
  const [ owner, minter1, minter2] = await hre.ethers.getSigners()

  await nft.connect(minter1).mint(2)
  const h_URI = await nft.connect(minter1).tokenURI(2)
  console.log("_____________________________________")
  console.log(`Hurray! Minter1 at ${minter1.address} has minted ${await nft.connect(minter1).getAddressMintedBalance(minter1.address)} Krypto Alienz`)
  console.log("_____________________________________")
  console.log(`The hidden alien can be found at ${h_URI}`)
  
  await nft.connect(owner).toggleReveal(true)
  const r_URI = await nft.connect(minter1).tokenURI(2)

  console.log("________________4 hours later_____________________")
  console.log(`The Alienz have been revealed`)
  console.log(`Minter1 at ${minter1.address}, your alien is at ${r_URI}`)
  console.log("#############sike###############")


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
