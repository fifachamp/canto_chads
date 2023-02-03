(async () => {
	require("dotenv").config();
	const hre = require("hardhat")
	const { ethers } = hre
	
	const chads = await ethers.getContractAt("CantoChads", process.env.CONTRACT_ADDRESS)

	const req = await chads.reserveChads()
	console.log(req)
	req.wait().then(e => {
		console.log('done!')
	})
})();

