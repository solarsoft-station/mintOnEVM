//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SSPunks is ERC721Enumerable, Ownable {
    //using the strings library for uint256 computations
    using Strings for uint256;

    /**
     * _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
     * token will br the concatenation of the 'baseURI' and the 'tokenId'
     */
    string _baseTokenURI;

    //_price is the cost of one SSPunks NFT
    uint256 public _price = 0.01 ether;

    //_paused is used to pause contract operations in case of an emergency
    bool public _paused;

    // max number of SSPunk tokens
    uint256 public maxTokenIds = 10;

    //to keep track of total number of tokenIds minted
    uint256 public tokenIds;

    //modifier, to restrict contract operations to only when not paused
    modifier onlyWhenNotPaused() {
        require(!_paused, "Contract is paused");
        _;
    }

    /**
     * ERC721 constructor takes in a `name` and a `symbol` to the token collection.
     * name in our case is `SSPunks` and symbol is `SSP`.
     * Constructor for SSP takes in the baseURI to set _baseTokenURI for the collection.
     */

    constructor(string memory baseURI) ERC721("SSPunks", "SSP") {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev mint() allows users to mint one SSP NFT per transaction
     */
    function mint() public payable onlyWhenNotPaused {
        require(tokenIds < maxTokenIds, "Exceed maximum SSPunks supply");
        require(msg.value >= _price, "Ether sent is incorrect");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    /**
     * @dev _baseURI() overrides the OpenZeppelin implementation which defaults to an empty string
     * for the baseURI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev tokenURI overrides the Openzeppelin's ERC721 implementation for tokenURI function
     * This function returns the URI from where we can extract the metadata for a given tokenId
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory baseURI = _baseURI();

        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    /**
     * @dev setPaused makes the contract paused or unpaused
        *takes in True or False
     */
    function setPaused(bool status) public onlyOwner {
        _paused = status;
    }

    /**
     * @dev withdraw sends all the ether in the contract to the owner of the contract
     */
    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ethernet address");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
