const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { Console } = require("console");

describe("ss-test", function () {
  // We define an fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTest() {
    const baseURI = "tingaling-IPFS/";
    const notRevealedURI = "unreleased-IPFS";
    const royalties = 4000; //40%
    const tokenURI = "/3.json";

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, oOtherAccount] = await ethers.getSigners();

    // const Test = await ethers.getContractFactory("test");
    const Altans = await ethers.getContractFactory("Altans");
    // const test = await Test.deploy(notRevealedURI, baseURI, royalties);
    const altans = await Altans.deploy(notRevealedURI, baseURI, royalties);

    return {
      // test,
      altans,
      baseURI,
      notRevealedURI,
      owner,
      otherAccount,
      oOtherAccount,
    };
  }

  describe("Deployment", function () {
    it("Should set the hidden/base URI", async function () {
      const { altans, notRevealedURI } = await loadFixture(deployTest);
      console.log("\n")
      console.log("We have predefined a baseURI, hiddenURI and royalty fee(45%)")

      console.log("afterDeployment- notRevealedUri: ", await altans.notRevealedURI());
      expect(await altans.notRevealedURI()).to.equal(notRevealedURI);
      await altans.setNotRevealedURI("/unreleased-IPFS/hiddem.json");
      // expect(await altans.notRevealedURI()).to.equal(notRevealedURI);
      console.log("afterCall- notRevealedUri: ", await altans.notRevealedURI());

      
    });

    it("Should set the right owner", async function () {
      const { altans, owner } = await loadFixture(deployTest);

      expect(await altans.owner()).to.equal(owner.address);
    });

    it("Should mint a token", async function () {
      const { altans, owner } = await loadFixture(deployTest);
      await altans.mint();
      expect(await altans.getAddressMintedBalance(owner.address)).to.equal(1);
      const bTokenURI = await altans.tokenURI(1);
      console.log("beforeMint:",bTokenURI);
      await altans.toggleReveal(true);
      const aTokenURI = await altans.tokenURI(1);
      console.log("afterMintNreveal:",aTokenURI);
      expect(await altans.ownerOf(1)).to.equal(owner.address);

    });

    it("Should mint 18 for NFTLondon with 45% royalty fee ", async function () {
      // We don't use the fixture here because we want a different deployment
      const [owner, receiver] = await ethers.getSigners();

      const Altans = await ethers.getContractFactory("Altans");
      const altans = await Altans.deploy("/unreleased-IPFS/hiddem.json", "/weAreAltansOnIpfs/", 4500);
      await altans.nftLondon(20);
      expect(await altans.getAddressMintedBalance(owner.address)).to.equal(20);
      await altans.toggleReveal(true);

      console.log("tokenUri token9:", await altans.tokenURI(9))

      //  await expect(altans.nftLondon(9)).to.changeTokenBalance(altans, owner, 9)
       await altans.transferFrom(owner.address, receiver.address, 9)
       await altans.transferFrom(owner.address, receiver.address, 14)
      
       console.log("tokenUri token14:", await altans.tokenURI(14))
       console.log("owner of token14: ", await altans.ownerOf(14))
      

      console.log("\n__transfer token 9 test__")
      expect(await altans.ownerOf(9)).to.equal(receiver.address)
    });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if token doesn't exist", async function () {
  //       const { test } = await loadFixture(deployTest);

  //       // await expect(test.tokenURI(26)).to.be.reverted
  //       await expect(test.tokenURI(26)).to.be.revertedWithCustomError(
  //         test,
  //         "URIQueryForNonexistentToken"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { test, otherAccount } = await loadFixture(deployTest);

  //       // We use test.connect() to send a transaction from another account
  //       // await expect(test.connect(otherAccount).withdraw()).to.be.reverted
  //       await expect(test.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "Ownable: caller is not the owner"
  //       );
  //     });
  //   });

  //   // describe("Events", function () {
  //   //   it("Should emit an event on receiving eth", async function () {
  //   //     const { test, oOtherAccount } = await loadFixture(deployTest);

  //   //     const transactionHash = await oOtherAccount.sendTransaction({
  //   //       to: test.address,
  //   //       value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
  //   //     });

  //   //     // console.log(transactionHash, "\n" ,test.interface.events)// We accept any value as `when` arg

  //   //     expect(
  //   //       Object.entries(test.interface.events).some(([k, v]) => {
  //   //         return v.name === "receivedUnsolicited";
  //   //       })
  //   //     ).to.be.equal(true);
  //   //   });
  //   // });

  //   // describe("Transfers", function () {
  //   //   it("Should transfer the funds to the owner", async function () {
  //   //     const { test, owner, oOtherAccount } = await loadFixture(deployTest);
  //   //     const ownerBalance = await ethers.provider.getBalance(owner.address);
  //   //     const value = ethers.utils.parseEther("2.0");
  //   //     const transactionHash = await oOtherAccount.sendTransaction({
  //   //       to: test.address,
  //   //       value: value, // Sends exactly 2.0 ether
  //   //     });
  //   //     const testBalance = await ethers.provider.getBalance(test.address);
  //   //     console.log("owner", ownerBalance);
  //   //     console.log("balance", testBalance);

  //   //     await test.withdraw();

  //   //     expect(await ethers.provider.getBalance(test.address)).to.equal(0);
  //   //   });

  //   //   // it("Should receive the funds from any address", async function () {
  //   //   //   const { test, owner, oOtherAccount } = await loadFixture(deployTest);
  //   //   //   const ownerBalance = await ethers.provider.getBalance(owner.address);
  //   //   //   const value = ethers.utils.parseEther("2.0");
  //   //   //   const transactionHash = await oOtherAccount.sendTransaction({
  //   //   //     to: test.address,
  //   //   //     value: value, // Sends exactly 2.0 ether
  //   //   //   });
  //   //   //   const testBalance = await ethers.provider.getBalance(test.address);

  //   //   //   await expect(testBalance).to.equal(value);
  //   //   // });
  //   // });
  // });
});
