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
  const Test = await hre.ethers.getContractFactory("test");
  const test = await Test.deploy(hiddenURI, baseURI, royalties);

  await test.deployed();

  console.log("testNFTContract deployed to:", test.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
