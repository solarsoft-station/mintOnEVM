// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // constructor arguments

  const baseURI = process.env.BASE_URI;
  const hiddenURI = process.env.HIDDEN_URI;
  const royalties = 4500; //45% default royalties

  // We get the contract to deploy
  const Test = await hre.ethers.getContractFactory("test");
  const test = await Test.deploy(hiddenURI, baseURI, royalties);

  await test.deployed();

  console.log("testNFTContract deployed to:", test.address);

  //Then we verify the contract on etherscan

  // run hardhat verify with etherscan
  await hre.run("verify:verify", {
    address: test.address, // Deployed contract address
    constructorArguments: [hiddenURI, baseURI, royalties],
  });

  console.log(
    "n\ Your test contract has been deployed to the network at",
    test.address,
    "n\ and it has been verified on the blockexplorer"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
