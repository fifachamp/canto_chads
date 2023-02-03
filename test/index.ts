// @ts-nocheck
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CantoChads", function () {
  let owner: any;
  let address1;
  let address2;
  let chadContract;

  beforeEach(async () => {
    [owner, address1, address2] = await ethers.getSigners();

    const tx = await address1.sendTransaction({
      to: owner.address,
      value: ethers.utils.parseEther("10.0")
    });

    const TokenFactory = await ethers.getContractFactory("NFT");
    const ChadFactory = await ethers.getContractFactory("CantoChads");
    
    chadContract = await TokenFactory.connect(owner).deploy("CantoChad", "canto chads");
    chadContract = await ChadFactory.connect(owner).deploy(
      "CantoChads",
      "CC",
      "yeye",
      '0xCDaeE8fcA82D3D90B572d6D1d48F12a7B19C5835',
    );
  });

  it("Should initialize the CantoChad contract", async () => {
    expect(await chadContract.maxChads()).to.equal(1111);
  });

  it("Should set the right owner", async () => {
    expect(await chadContract.owner()).to.equal(await owner.address);
  });

  it("Should mint a chad", async () => {
    await chadContract.flipSaleState();
    const chadPrice = await chadContract.chadPrice();
    const tokenId = await chadContract.totalSupply();
    const mintRes = await chadContract.mintChad(1, {value: chadPrice})

    expect(mintRes).to.emit(chadContract, "Transfer")
    .withArgs(ethers.constants.AddressZero, owner.address, tokenId);
  });

  it("mint a chad has a url", async () => {
    await chadContract.flipSaleState();
    const chadPrice = await chadContract.chadPrice();
    const tokenId = await chadContract.totalSupply();
    const res = await chadContract.mintChad(1, {value: chadPrice})
  });

  it("reserve chads for ourselves works ", async () => {
    const res = await chadContract.reserveChads();
    const owned = (await chadContract.balanceOf(owner.address)).toNumber()
    expect(owned).to.equal(135)
    const tokenId = await chadContract.totalSupply();
    expect(tokenId).to.equal(135)
  });

  it("Chads are correct price.", async () => {
    let tokenId = await chadContract.totalSupply();
    expect(tokenId).to.equal(0)
    for (var i = 0; i < 5; i++) {
      await chadContract.reserveChads();
    }
    tokenId = await chadContract.totalSupply();
    expect(tokenId).to.equal(675)
    await chadContract.flipSaleState();
    const chadPrice = await chadContract.connect(address1).chadPrice();
    expect(chadPrice).to.equal("111")

    const res = await chadContract.connect(address1).mintChad(6, {
      value: chadPrice.mul(6),
    })

    const owned = (await chadContract.connect(address1).balanceOf(address1.address)).toNumber()
    expect(owned).to.equal(6)
  })

  it("Should fail minting > maxSupply", async () => {
    let tokenId = await chadContract.totalSupply();
    expect(tokenId).to.equal(0)
    for (var i = 0; i < 8; i++) {
      await chadContract.reserveChads();
    }
    
    await chadContract.flipSaleState();
  
    tokenId = await chadContract.totalSupply();
    expect(tokenId).to.equal(1080)
    const chadPrice = await chadContract.connect(address1).chadPrice();
    expect(chadPrice).to.equal("111")

    await expect(chadContract.connect(address1).mintChad(32, {
      value: chadPrice.mul(32),
    })).to.be.revertedWith("No more Chads left")
  })

  it("Should fail minting > single wallet limit", async () => {
    let tokenId = await chadContract.totalSupply();
    expect(tokenId).to.equal(0)
    const chadPrice = await chadContract.chadPrice();
    
    await chadContract.flipSaleState();
    for (var i = 0; i < 32; i++) { 
      const res = await chadContract.connect(address1).mintChad(1, {value: chadPrice})
    }
    tokenId = await chadContract.totalSupply();
    await expect(chadContract.connect(address1).mintChad(1, {
      value: chadPrice.mul(1),
    })).to.be.revertedWith("Max of 10 Chads per wallet")
  })
});
