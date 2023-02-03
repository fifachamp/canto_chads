(async () => {
	require("dotenv").config();
	const hre = require("hardhat")
	const { ethers } = hre
	
	const Chad = await ethers.getContractAt("CantoChads", process.env.CONTRACT_ADDRESS)

	const req = await Chad.withdraw()
	console.log(req)
	req.wait().then(e => {
		console.log('done!')
	})
})();

