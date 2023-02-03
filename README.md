readme.md


### PROD
1. app.py 71 ~ change to mainnet
2. app.py 83 84 ~ make sure abi and addressses are corerect 
3. reset redis 
4. clear all jobs

### generate

```
python generate.py --amount 1000 --config config.json
```

### install 

### api docs

http://127.0.0.1:3000

POST to `/api/generate`
JSON Body
```
[
    {
        "character":"Mom",
        "tokenId": 1,
        "signature": "0x18238129381abacbacbacb129391293",
        "message": "this is a message"
    },
    {
        "character":"Dad",
        "tokenId": 2
    }
]
```


```
# Person values: 
# Mom
# Dad
# Son
# Baby
# Dog
```

http://127.0.0.1:3000

GET to `/api/balances`

response 
```
{
    "Baby": "2",
    "Dad": "5",
    "Dog": "2",
    "Mom": "1",
    "Son": "0"
}
```


### info 

1. metadata is `https://res.cloudinary.com/hqsllgz1e/raw/upload/metadata/0`
2. img is `https://res.cloudinary.com/hqsllgz1e/image/upload/images/0.png`


### todo
1. flask app json request  √

2. vercel setup [ ] 
3. circleci √

2. generate img https://github.com/Jon-Becker/nft-generator-py √
3. upload to clooudinary https://cloudinary.com/documentation/django_image_and_video_upload#server_side_upload

4. generate metadata  √
5. upload to cloudinary √ 

6. queue up jobs to https://python-rq.org
7. creat eone image+metadat per person , initially just upload the person √
7. store what index on server for each img + metadae per person ugh √
7. custom job - get all minted tokens, if it doesnt have metadata + img yet, generaate random  √
/

Pool Water 1 - Cool Blue
Pool Water 2 - Deep Blue
Pool Water 3- Lavender Blue
Pool Water 4 - Murky Green
Pool water 5 - Pissy Wonky


#### need from trace 

water names 
poop rarities
metadata


#### test cases 

1. mint 10 of each character, when you render on OPENSEA it shows the same character that you minted 
2. raace condition , if you mint 1,2,3 and he mints 7,8,9 before you mint 4,5,6 -> that your characters are still correct.


# nft-generator-py

![preview](https://github.com/Jon-Becker/nft-generator-py/blob/main/preview.png?raw=true)

nft-generator-py is a python based NFT generator which programatically generates unique images using weighted layer files. The program is simple to use, and new layers can  be added by adding a new layer object and adding names, weights, and image files to the object.
You can [View The Demo](https://jbecker.dev/demos/nft-generator-py) here.

## Usage
As of v2.0.0, nft-generator-py will use the argparse library in order to support external configuration files and won't require users to interact with the python files themselves.

1. Install requirements: `python3 -m pip install -r requirements.txt`
2. Make a configuration JSON file. See the configuration section below for specifications.
3. Add layer files into the `/images` folder.
4. Run the command `python3 generate.py --amount AMOUNT --config CONFIG`
   
   where:
   1. `AMOUNT` is the amount of images to generate
   2. `CONFIG` is the path pointing to a `.json` file containing valid program configuration.

## How it works
- A call to `generate_unique_images(amount, config)` is made, which is the meat of the application where all the processing happens.
- The `config` object is read and for each object in the `layers` list, random values are selected and checked for uniqueness against all previously generated metadata files.
- Once we have `amount` unique tokens created, we layer them against eachother and output them and their metadata to their respective folders, `./metadata` and `./images`.

### Configuration
```
{
  "layers": [
    {
      "name": "Background",
      "values": ["Blue", "Orange", "Purple", "Red", "Yellow"],
      "trait_path": "./trait-layers/backgrounds",
      "filename": ["blue", "orange", "purple", "red", "yellow"],
      "weights": [30, 45, 15, 5, 10]
    },
    ...
  ],
  "incompatibilities": [
    {
      "layer": "Background",
      "value": "Blue",
      "incompatible_with": ["Python Logo 2"],
      "default": {
        "value": "Default Incompatibility",
        "filename": "./trait-layers/foreground/logo"
      }
    }
  ],
  "baseURI": ".",
  "name": "NFT #",
  "description": "This is a description for this NFT series."
}
```

The `config` object is a dict that contains configuration instructions that can be changed to produce different outputs when running the program. Within metadata files, tokens are named using the configuration's `name` parameter, and described using the `description` parameter. 
- In ascending order, tokenIds are appended to the `name` resulting in NFT metadata names such as NFT #0001. 
- tokenIds are padded to the largest amount generated. IE, generating 999 objects will result in names NFT #001, using the above configuration, and generating 1000 objects will result in NFT #0001.
- As of `v1.0.2`, padding filenames has been removed.

The `layers` list contains `layer` objects that define the layers for the program to use when generating unique tokens. Each `layer` has a name,  which will be displayed as an attribute, values, trait_path, filename, and weights.
- `trait_path` refers to the path where the image files in `filename` can be found. Please note that filenames omit .png, and it will automatically be prepended.
- `weight` corresponds with the percent chance that the specific value that weight corresponds to will be selected when the program is run. The weights must add up to 100, or the program will fail.

The `incompatibilities` list contains an object that tells the program what layers are incompatible with what. In the above configuration, A Blue Background `layer` will *never* be generated with Python Logo 2.
- `layer` refers to the targeted layer.
- `value` is the value of the layer that is incompatible with attributes within the `incompatible_with` list.
- `incompatible_with` is the list of incompatible layers that will never be selected when `layer` has attribute `value`.
- An optional `default` object can be provided to each incompatibility. This object will be selected 100% of the time if present and an incompatible layer is selected. The `default` object has a `value` and `filename` attribute.
  - `value` is the name of the default selection which will be displayed in the metadata.
  - `filename` is the path to the image file that will be used as the default selection.

As of `v1.0.2`, the IPFS CID may be updated programatically after generating NFTs and uploading `/images` to IPFS. This will update all metadata files to correctly point `"image"` to the IPFS CID.
- *This is an optional step, and can be exited safely using `enter` or `control + c`.*

#### Troubleshooting
- All images should be in .png format.
- All images should be the same size in pixels, IE: 1000x1000.
- The weight values for each attribute should add up to equal 100.

### Credits
This project is completely coded by [Jonathan Becker](https://jbecker.dev), using no external libraries.

=======
## Project Setup

To install dependencies
```shell
yarn add
```

To compile the contracts 
```shell
npx hardhat compile
```

To run the tests 
```shell
npx hardhat test
```

To deploy the project in a local evm instance
```shell
npx hardhat run scripts/<script_name> 
```

To deploy the project in specfic network
```shell
npx hardhat run scripts/<script_name> --network <network_name>
```


## Connection Node

To create a connection node, we use https://infura.io/ and we're going to take the endpoint URL (Very Important get the properly URL of the network that we're going to use)

Furthermore, we need to get from Metamask the private key of the wallet that we're going to use and setup those variables in the env file

## Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
