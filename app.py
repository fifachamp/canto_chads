import os 
from flask import Flask, request, jsonify
from flask_cors import CORS
import rq_dashboard
from decouple import config
import eth_utils

import requests

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)
# cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config.from_object(rq_dashboard.default_settings)
app.config['REDIS_URL'] = config('REDIS_URL', 'redis://localhost:6379/0')
app.register_blueprint(rq_dashboard.blueprint, url_prefix="/rq")


from rq import Connection, Queue
from redis import Redis
redis_conn = Redis.from_url(os.environ.get('REDIS_URL') or 'redis://localhost:6379/0')

q = Queue('placeholder', connection=redis_conn)
q1 = Queue('missing_placeholder', connection=redis_conn)
q2 = Queue('reveal', connection=redis_conn)
q3 = Queue('safe_reveal', connection=redis_conn)

from job import set_placeholder, reveal

def safe_get(person):
	index = redis_conn.get(person)
	if index:
		index = int(index) 
	else: 
		index = 0
	return index

def get_first_available_person():
	import random
	persons = [
		"Mom",
		"Dad",
		"Son",
		"Baby",
		"Dog"
	]
	random.shuffle(persons)
	for person in persons:
		index = safe_get(person)
		if index < 1000:
			return( person)
		return "Ran out of people"

@app.route("/")
def index():
	return "Hello World!"

@app.route("/api/balances")
def balances():
	return {
		"Mom": safe_get("Mom"),
		"Dad": safe_get("Dad"),
		"Son": safe_get("Son"),
		"Baby": safe_get("Baby"),
		"Dog": safe_get("Dog")
	}

# https://web3py.readthedocs.io/en/latest/web3.main.html#cryptographic-hashing
# url = "https://rinkeby.infura.io/v3/2a04dcbadcd1498998f43d14a0bd6494"
url = "https://mainnet.infura.io/v3/2a04dcbadcd1498998f43d14a0bd6494"
# todo: change to prod!! 

from web3 import Web3, EthereumTesterProvider, IPCProvider
from web3.auto.gethdev import w3
from web3.middleware import geth_poa_middleware
from eth_account.messages import encode_defunct, _hash_eip191_message
from hexbytes import HexBytes

w3 = Web3(Web3.HTTPProvider(url))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

abi = """[{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint16","name":"maxNftSupply","type":"uint16"},{"internalType":"string","name":"_initBaseURI","type":"string"},{"internalType":"address payable","name":"_payoutAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"FREE_MINT_LIMIT","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_FREE_MINT_PURCHASE","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxPoops","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"flipSaleState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxPoops","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"numberOfTokens","type":"uint8"}],"name":"mintPoop","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"payoutAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poopPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reservePoops","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleIsActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]"""
address = "0x9940F1D41757305D3417491829b8b258BcEA2ed4"
# todo: change to prod!! 
contract_instance = w3.eth.contract(abi=abi, address=address)

@app.route("/api/generate", methods=['POST'])
def generate():
	nfts = request.json

	if not "signature" in nfts[0]:
		return "Missing signature"
	if not "message" in nfts[0]:
		return "Missing message"

	message = encode_defunct(text=nfts[0]["message"])
	signature = nfts[0]["signature"]
	signer = ""
	try:
		signer = w3.eth.account.recover_message(message,signature=HexBytes(signature))
	except eth_utils.exceptions.ValidationError as e:
		return("Bad signature: " + str(e))

	token_id = int(nfts[0]['tokenId'])

	# find token ids without metadata
	redis_token_id = safe_get('token_id')
	# if we skipped at least one token, fill in missing metadata
	if (token_id - redis_token_id) > 1:
		tokens = list(range(redis_token_id + 1, token_id))
		for token in tokens:
			person = get_first_available_person()
			index = safe_get(person)

			redis_conn.incr(person)

			# job = q1.enqueue(set_placeholder, str(token), person, index, False)
			job = q2.enqueue(reveal, str(token), person, index)

	for nft in nfts:
		token_id = str(nft['tokenId'])

		owner = contract_instance.functions.ownerOf(int(token_id)).call()

		# compare actual owner vs signer 
		if signer.lower() != owner.lower():
			print("invalid tx : owner is " + owner + " and signer is " + signer)
			continue

		person = nft['person'].capitalize() 

		index = safe_get(person)

		if index >= 1000:
			person = get_first_available_person()
			index = safe_get(person)

		redis_conn.incr(person)

		# job = q.enqueue(set_placeholder, token_id, person, index, True)
		job = q2.enqueue(reveal, token_id, person, index)

		redis_conn.set("token_id", token_id)
		
	return "Queued up jobs."

if __name__ == '__main__':
	app.run(host='127.0.0.1',debug=True, port=os.environ.get('PORT'))
