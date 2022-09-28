const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("ss-test", function () {
  // We define an fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTest() {
    const baseURI = "";
    const notRevealedURI = "";
    const royalties = 4000; //40%
    const tokenURI = "/3.json";

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, oOtherAccount] = await ethers.getSigners();

    const Test = await ethers.getContractFactory("test");
    const test = await Test.deploy(notRevealedURI, baseURI, royalties);

    return {
      test,
      baseURI,
      notRevealedURI,
      owner,
      otherAccount,
      oOtherAccount,
    };
  }

  describe("Deployment", function () {
    it("Should set the hidden URI", async function () {
      const { test, notRevealedURI } = await loadFixture(deployTest);

      expect(await test.notRevealedURI()).to.equal(notRevealedURI);
    });

    it("Should set the right owner", async function () {
      const { test, owner } = await loadFixture(deployTest);

      expect(await test.owner()).to.equal(owner.address);
    });

    it("Should mint a token", async function () {
      const { test, owner } = await loadFixture(deployTest);
      await test.mint(2);
      expect(await test.getAddressMintedBalance(owner.address)).to.equal(2);
    });

    it("Should fail if the quantity is more than 2 ", async function () {
      // We don't use the fixture here because we want a different deployment
      const [account, otherAccount] = await ethers.getSigners();
      const Test = await ethers.getContractFactory("test");
      const test = await Test.deploy("", "", 4500);

    //   await expect(test.connect(otherAccount).mint(3)).to.be.reverted
      await expect(test.connect(otherAccount).mint(3)).to.be.revertedWithCustomError(
        test,
        "minIsOneAndMintCapIsTwo"
      );
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if token doesn't exist", async function () {
        const { test } = await loadFixture(deployTest);

        // await expect(test.tokenURI(26)).to.be.reverted
        await expect((test.tokenURI(26))).to.be.revertedWithCustomError(
            test,
            "URIQueryForNonexistentToken"
          );
      });

      it("Should revert with the right error if called from another account", async function () {
        const { test, otherAccount } = await loadFixture(
          deployTest
        );

        // We use test.connect() to send a transaction from another account
        // await expect(test.connect(otherAccount).withdraw()).to.be.reverted
        await expect(test.connect(otherAccount).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");
        
      });
    });

    describe("Events", function () {
      it("Should emit an event on receiving eth", async function () {
        const { test, oOtherAccount } = await loadFixture(deployTest);

        const transactionHash = await oOtherAccount.sendTransaction({
          to: test.address,
          value: ethers.utils.parseEther("1.0")  // Sends exactly 1.0 ether
        });

        // console.log(transactionHash, "\n" ,test.interface.events)// We accept any value as `when` arg
        
        expect(
            Object.entries(test.interface.events).some(
              ([k, v]) => v.name === "reveivedUnsolicited"
            )
          ).to.be.equal(true);

      });
    });

    describe("Transfers", function () {
        it("Should transfer the funds to the owner", async function () {
          const { test, owner, oOtherAccount } = await loadFixture(
            deployTest
          );
          const ownerBalance = await ethers.provider.getBalance(owner.address);
          const value = ethers.utils.parseEther("2.0");
          const transactionHash = await oOtherAccount.sendTransaction({
              to: test.address,
              value: value // Sends exactly 2.0 ether
            });
          const testBalance = await ethers.provider.getBalance(test.address);
                console.log ("owner", ownerBalance)
                console.log ("balance", testBalance)
  
            await test.withdraw();
  
         expect(await ethers.provider.getBalance(test.address)).to.equal(0);
  
        });

        it("Should receive the funds from any address", async function () {
            const { test, owner, oOtherAccount } = await loadFixture(
              deployTest
            );
            const ownerBalance = await ethers.provider.getBalance(owner.address);
            const value = ethers.utils.parseEther("2.0");
            const transactionHash = await oOtherAccount.sendTransaction({
                to: test.address,
                value: value // Sends exactly 2.0 ether
              });
            const testBalance = await ethers.provider.getBalance(test.address);
    
            await expect(testBalance).to.equal(value);
          });
      });
  });
});
