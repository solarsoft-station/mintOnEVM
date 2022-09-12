/**
 *  This script will calculate the constructor arguments for the `verify` function and call it.
 *  You can use this script to verify the contract on etherscan.io.
 */

 require("@nomiclabs/hardhat-etherscan");
 const hre = require("hardhat");
 
 // constructor argument
 const BASE_URI =
   "ipfs://bafyPasteBaseURIherejw7pi2xrlim77kedf5znkiwdh3by2xz5uf7kyq/";
 const HIDDEN_URI = "ipfs://bafyPasteHiddenURIi2xrlim77kedf5znkiwdh3by2xz5uf7kyq/"
 const ROYALTIES = 4500; //45% royalties on each token
 async function main() {
   // run hardhat verify with etherscan
 
   await hre.run("verify:verify", {
     address: "pastecontractaddresshere", // Deployed contract address
     constructorArguments: [HIDDEN_URI, BASE_URI, ROYALTIES],
   });

   console.log("Contract at", `pastecontractaddresshere`, "has been verified successfully")
 }
 
 // We recommend this pattern to be able to use async/await everywhere
 // and properly handle errors.
 main()
   .then(() => {
     process.exitCode = 0;
   })
   .catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
 