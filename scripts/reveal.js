
(async () => {
	require("dotenv").config();
	const hre = require("hardhat")
	const { ethers } = hre
	
	let  poopyContract = await ethers.getContractAt('PoopyInThePool', process.env.CONTRACT_ADDRESS)

	// poopyContract._baseURI().then(console.log)

	const req = await poopyContract.setBaseURI('res.cloudinary.com/hqsllgz1e/raw/upload/metadata/')
	console.log(req)
	req.wait().then(e => {
		console.log('done!')
	})

	// poopyContract.baseURI().then(console.log)
})();

