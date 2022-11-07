// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ALTANS_CONTRACT_ADDRESS, abi, DEPLOYER } = require("./constants");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const baseURI = process.env.BASE_URI;
  const hiddenURI = process.env.HIDDEN_URI;
  //   const royalties = 2500; //45% default royalties

  console.log("_____________________________________");
  console.log("_____________________________________");

  //We get the contract to deploy
  const Altans = await hre.ethers.getContractFactory("Altans");
  const altans = await Altans.deploy();

  await altans.deployed();

  console.log("\naltansNFTContract deployed to:", altans.address);
  console.log("_____________________________________");

  //   const Altans = await ethers.getContractFactory("Altans");
  //   const altans = await Altans.attach(
  //     "0x82679e20eD49Bbb507BFED57C59181664eE63CAc" // The deployed contract address
  //   );

  await sleep(30000);
  //Then we verify the contract on etherscan
  console.log("now attempting to verify...");
  // run hardhat verify with etherscan
  await hre.run("verify:verify", {
    address: altans.address, // Deployed contract address
    constructorArguments: [],
  });

  console.log(
    "\n Your Altans contract has been deployed to the network at",
    altans.address,
    "\n and it has been verified on the blockexplorer"
  );

  await altans.setNotRevealedURI(hiddenURI);

  const contractOwner = await altans.owner();
  console.log(" contract owner: ", contractOwner);

  await altans.unpause();

  await altans.adminMint(contractOwner, 20);

  const owner = await altans.ownerOf(1);

  console.log("\nMinting 20 altans for nftLondon... from", contractOwner);

  //   //  const altans = new ethers.Contract( address , abi , signerOrProvider )
  //   //  altans.connect( providerOrSigner )

  console.log("_____________________________________");
  console.log(
    `Solarsoft ${contractOwner} has minted ${await altans.balanceOf(
      owner
    )} Altans for NFTLondon`
  );
  console.log("_____________________________________");

  console.log("_____________________________________");
  await sleep(30000);

  await altans.setBaseURI(
    "https://solarsoft.mypinata.cloud/ipfs/altans-cid-here/"
  );

  const r_URI = await altans.tokenURI(4);

  console.log("_______few blocks later_______");

  console.log(`The Altans have been revealed`);
  console.log(`Find Altan 4 at ${r_URI}`);
  console.log(`its owner is ${await altans.ownerOf(4)}`);
  console.log("#############solarsoft###############");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
