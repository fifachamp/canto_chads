(async () => {
	require("dotenv").config();
	const hre = require("hardhat")
	const { ethers } = hre
	
	const Poopy = await ethers.getContractAt("PoopyInThePool", process.env.CONTRACT_ADDRESS)

	const req = await Poopy.totalSupply()
  console.log(req.toString())
	console.log('done!')
})();

