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
    const Altans = await ethers.getContractFactory("AltansA");
    // const test = await Test.deploy(notRevealedURI, baseURI, royalties);
    const altans = await Altans.deploy();

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
    // it("Should set the hidden/base URI", async function () {
    //   const { altans, baseURI } = await loadFixture(deployTest);
    //   console.log("\n")
    //   console.log("We have predefined a baseURI, hiddenURI and royalty fee(45%)")

    //   console.log("afterDeployment- notRevealedUri: ", await altans.notRevealedURI());
    //   expect(await altans.notRevealedURI()).to.equal(notRevealedURI);
    //   await altans.setBaseURI("/unreleased-IPFS/hiddem.json");
    //   // expect(await altans.notRevealedURI()).to.equal(notRevealedURI);
    //   console.log("afterCall- notRevealedUri: ", await altans.notRevealedURI());

      
    // });

    it("Should set the right owner", async function () {
      const { altans, owner } = await loadFixture(deployTest);

      expect(await altans.owner()).to.equal(owner.address);
    });

    it("Should mint a token", async function () {
      const { altans, owner } = await loadFixture(deployTest);
      await altans.unpause()
      await altans.mint(1);
      const aTokenURI = await altans.tokenURI(1);
      console.log("afterUnpauseAndMint:",aTokenURI);
      expect(await altans.ownerOf(1)).to.equal(owner.address);

    });

    it("Should mint 20 for NFTLondon with 45% royalty fee ", async function () {
      // We don't use the fixture here because we want a different deployment
      const [owner, receiver] = await ethers.getSigners();

      const Altans = await ethers.getContractFactory("AltansA");
      const altans = await Altans.deploy();

      await altans.setBaseURI("/unreleased-IPFS/hiddem.json");
      // expect(await altans.notRevealedURI()).to.equal(notRevealedURI);
      await altans.unpause()


      await altans.adminMint(receiver.address, 20);

      expect(await altans.balanceOf(receiver.address)).to.equal(20);

      console.log("tokenUri token9:", await altans.tokenURI(2))

      //  await expect(altans.nftLondon(9)).to.changeTokenBalance(altans, owner, 9)
       await altans.connect(receiver).transferFrom(receiver.address, owner.address, 1)
       await altans.connect(receiver).transferFrom(receiver.address, owner.address, 2)
      
       console.log("tokenUri token1:", await altans.tokenURI(1))
       console.log("owner of token1: ", await altans.ownerOf(1))
      

      console.log("\n__transfer token 9 test__")
      expect(await altans.ownerOf(1)).to.equal(owner.address)
    });
  });

 
});
