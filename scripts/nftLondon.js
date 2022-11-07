// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const{ALTANS_CONTRACT_ADDRESS, abi, DEPLOYER} = require("./constants");


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const baseURI = process.env.BASE_URI;
  const hiddenURI = process.env.HIDDEN_URI;
  const royalties = 2500; //45% default royalties
  console.log("We have sent out Altans to an Ethereum Blockchain fork with Hardhat from 0x2353e4BF6d4fD72fA49335D17839EA84A2f7ceCa");

  console.log("at *** baseURI and *** hiddenURI *** royalties=25%");

  console.log("_____________________________________");
  console.log("_____________________________________");

  
  // We get the contract to deploy
  const Altans = await hre.ethers.getContractFactory("Altans");
  const altans = await Altans.deploy(hiddenURI,baseURI, royalties);

  await altans.deployed();

  console.log("\naltansNFTContract deployed to:", altans.address);
  console.log("_____________________________________");


  // await sleep(30000);
  //Then we verify the contract on etherscan
  console.log("now attempting to verify...");
  // run hardhat verify with etherscan
  // await hre.run("verify:verify", {
  //   address: altans.address, // Deployed contract address
  //   constructorArguments: [baseURI, royalties],
  // });

  console.log(
    "\n Your Altans contract has been deployed to the network at",
    altans.address,
    "\n and it has not been verified on the blockexplorer"
  );

  // await altans.setNotRevealedURI(hiddenURI);
  await altans.nftLondon(20);

  const contractOwner = await altans.owner()
  const owner = await altans.ownerOf(1)

  console.log("\nMinting 20 altans for nftLondon... from", contractOwner)

  //  const altans = new ethers.Contract( address , abi , signerOrProvider )
  //  altans.connect( providerOrSigner )

  console.log("_____________________________________");
  console.log(
    `Solarsoft ${contractOwner} has minted ${await altans
      .getAddressMintedBalance(owner)} Altans for NFTLondon`
  );
  console.log("_____________________________________");
  console.log(`The hidden altans can be found at ${hiddenURI}`);
  console.log("_____________________________________");
  // await sleep(30000);


  await altans.toggleReveal(true);
  const r_URI = await altans.tokenURI(4);

  console.log("_______few blocks later_______");

  console.log(`The Altans have been revealed`);
  console.log(`Find Altan 4 at ${r_URI}`);
  console.log(`its owner is ${await altans.ownerOf(4)}`)
  console.log("#############solarsoft###############");

  await altans.transferFrom(contractOwner, "0xdb129ad2063cc152884b394f53b160ab9f839f1b", 9)
  console.log("transerred 9 to", "0xdb129ad2063cc152884b394f53b160ab9f839f1b")
  await altans.transferFrom(contractOwner, "0xdb129ad2063cc152884b394f53b160ab9f839f1b", 14)
  console.log("transerred 14 to", "0xdb129ad2063cc152884b394f53b160ab9f839f1b")


   // await sleep(30000);
  //Then we verify the contract on etherscan
  console.log("now attempting to verify...");
  // run hardhat verify with etherscan
  // await hre.run("verify:verify", {
  //   address: altans.address, // Deployed contract address
  //   constructorArguments: [baseURI, royalties],
  // });
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
