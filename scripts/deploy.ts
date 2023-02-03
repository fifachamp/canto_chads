import { ethers } from "hardhat";

async function main() {
  const CantoChads = await ethers.getContractFactory("CantoChads");
  const chads = await CantoChads.deploy(
    "Canto Chads",
    "CC",
    "https://ipfs.io/ipfs/QmXdZmRvuhTwLGiffzo9rAtWLxKf9DKUufL34DZYucUDWK/",
    "0x13EDCF3D9E4a6d1273e2AC856a487Fb7452CF754"
  );

  await chads.deployed();
  console.log(
    `CantoChads deployed to ${chads.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
 
// npx hardhat verify --network rinkeby 0x5659E887dC3dA246037243Be293980a9550FD028 PoopyInThePool Poopy 5000 https://res.cloudinary.com/hqsllgz1e/raw/upload/metadata/ 0xA4392d46E9E9FB82e6331cE4487866a126D915d6