// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "base64-sol/base64.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "./ERC2981Base.sol";
import "./NFT.sol";

contract CantoChads is ERC721Enumerable, Ownable {
  event Mint(uint256 _tokenId);
  uint8 public constant WALLET_LIMIT = 10;
  uint16 public constant maxChads = 2222;
  bool public saleIsActive = false;
  address payable public payoutAddress;
  string private _baseURIextended;
  constructor(
    string memory name, 
    string memory symbol,
    string memory _initBaseURI,
    address payable _payoutAddress
  ) ERC721(name, symbol) {
    payoutAddress = _payoutAddress;
    _baseURIextended = _initBaseURI;
  }

  function withdraw() public onlyOwner {
    uint balance = address(this).balance;
    payable(msg.sender).transfer(balance);
  }

  function reserveChads() public onlyOwner {        
    uint256 mintIndex = totalSupply() + 1;
    for(uint8 i = 0; i < 186; i++) {
      _safeMint(msg.sender, mintIndex + i);
    }
  }

  function chadPrice() public view returns (uint256) {
    return price();
  }

  function price() internal view returns (uint256) {
    return 111 ether;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURIextended;
  }

  function setBaseURI(string calldata baseURI) external onlyOwner {
    _baseURIextended = baseURI;
  }

  function _maxChads() public view returns (uint16) {
    return maxChads;
  }

  function flipSaleState() public onlyOwner {
    saleIsActive = !saleIsActive;
  }

  function mintChad(uint8 numberOfTokens) public payable {
    require(saleIsActive, "Sale must be active to mint");
    require((totalSupply() + numberOfTokens) <= maxChads, "No more Chads left");
    require(numberOfTokens <= WALLET_LIMIT, "Max of 10 Chads per wallet");

    for(uint8 i = 0; i < numberOfTokens; i++) {
      uint256 balance = ERC721(address(this)).balanceOf(msg.sender);
      require(balance < WALLET_LIMIT, "Max of 10 Chads per wallet");
      if (totalSupply() < maxChads) {
        uint256 mintIndex = totalSupply();
        uint256 tokenId = mintIndex + 1;
        _safeMint(msg.sender, tokenId);
        emit Mint(tokenId);
      }
    }
  }
}
