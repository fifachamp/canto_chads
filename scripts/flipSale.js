(async () => {
	require("dotenv").config();
	const hre = require("hardhat")
	const { ethers } = hre
	const CantoChads = await ethers.getContractAt("CantoChads", process.env.CONTRACT_ADDRESS)

	const req = await CantoChads.flipSaleState()
	console.log(req)
	req.wait().then(e => {
		console.log('done!')
	})
})();

