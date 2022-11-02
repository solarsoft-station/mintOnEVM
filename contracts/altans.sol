//SPDX-License-Identifier: LICENSED
pragma solidity ^0.8.9;

// import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Altans is Ownable, ERC2981, ERC721Enumerable, ReentrancyGuard {
    using Strings for uint256;
    using Counters for Counters.Counter;

    uint256 public maxSupply = 20;
    bool public revealed = false;
    string public notRevealedURI;
    string public baseExtension = ".json";
    string public baseURI; // ipfs://ID/
    // string private uris;
    // bool status;

    mapping(uint256 => uint256) private royaltyOverrides;
    mapping(address => uint256) public addressMintedBalance;
    mapping(uint256 => string) private tokenURIs;

    error minIsOneAndMintCapIsOne();
    error maxTokensPerAddress();
    error maximumSupply();
    error URIQueryForNonexistentToken();

    event receivedUnsolicited(address sender, uint256 amount);

    constructor(
        // string memory _notRevealedURI,
        string memory _baseTokenURI,
        uint96 royalties
    ) ERC721("Altans", "A") {
        // setNotRevealedURI(_notRevealedURI);
        setBaseURI(_baseTokenURI);
        _setDefaultRoyalty(msg.sender, royalties);
    }

    function _startTokenId() internal view virtual returns (uint256) {
        return 1;
    }

    function mint(uint256 quantity) external nonReentrant {
        require(msg.sender == tx.origin, "HAhaha Satoshi had plans");
        require(
            addressMintedBalance[msg.sender] < 1,
            "You are allowed to have only 1 Altan in this wallet"
        );

        if (totalSupply() + quantity > maxSupply) revert maximumSupply();

        if (addressMintedBalance[msg.sender] == 1) revert maxTokensPerAddress();

        if (quantity > 1) revert minIsOneAndMintCapIsOne();

        // uint256 amb = addressMintedBalance[msg.sender];
        addressMintedBalance[msg.sender] += quantity;

        _safeMint(msg.sender, quantity, "testToken");
    }

    function getAddressMintedBalance(address minter)
        public
        view
        returns (uint256)
    {
        return addressMintedBalance[minter];
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        public
        view
        virtual
        override
        returns (address, uint256)
    {
        (address receiver, uint256 royaltyAmount) = ERC2981.royaltyInfo(
            _tokenId,
            _salePrice
        );
        // Use override amount if present
        if (royaltyOverrides[_tokenId] != 0) {
            royaltyAmount = royaltyOverrides[_tokenId];
        }
        return (receiver, royaltyAmount);
    }

    function setRoyaltyOverride(uint256 _tokenId, uint256 _amount)
        external
        onlyOwner
    {
        royaltyOverrides[_tokenId] = _amount;
    }

    function setRoyaltyInfo(address receiver, uint96 royaltyFees)
        public
        onlyOwner
    {
        require(
            receiver != address(0),
            "Please send royalties to a valid receipient"
        );
        _setDefaultRoyalty(receiver, royaltyFees);
    }

    function withdraw() external payable onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        if (!revealed) {
            return notRevealedURI;
        }

        string memory currentBaseURI = baseURI;
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setNotRevealedURI(string memory _newURI) public onlyOwner {
        notRevealedURI = _newURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function toggleReveal(bool _status) public onlyOwner {
        revealed = _status;
    }

    fallback() external payable {
        emit receivedUnsolicited(msg.sender, msg.value);

    }

    receive() external payable {
        emit receivedUnsolicited(msg.sender, msg.value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC2981, ERC721Enumerable)
        returns (bool)
    {
        return
            ERC721Enumerable.supportsInterface(interfaceId) ||
            ERC2981.supportsInterface(interfaceId);
    }
}
