import json
 
count = 0
while (count < 911):
    # count = count + 1
    # # Data to be written
    # dictionary = { 
    #   "name": "cPoorsche NFT " + str(count) +"/911",
    #   "description": "An poor car turned viral. A car that had a hard night with friends. A car born poor. Owning one of 911 Poorsche NFTs reminds you how poor you are. It's a me, Lightning McPoor",
    #   "image": "ipfs://bafkreicnbqq4y74cs4npmkleadg3gx2vdu4mgs5k6y3bmvoalf6i2ptsxi",
    #   "attributes": [
    #     {
    #       "trait_type": "Name",
    #       "value": "cPoorsche NFT"
    #     }
    #   ]
    # }
    

    # # Serializing json
    # json_object = json.dumps(dictionary, indent=2)
    
    # # Writing to sample.json
    # with open(str(count), "w") as outfile:
    #   outfile.write(json_object)
    count = count + 1
    name = str(count) + '.json'
    os.rename(str(count), name)