// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CreatorContent is ERC721, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Content {
        string ipfsHash;
        string contentType;
        string license;
        uint256 price;
        address creator;
        uint256 royaltyPercentage;
        bool isExclusive;
    }

    mapping(uint256 => Content) public contents;
    mapping(address => uint256[]) public creatorContents;

    event ContentMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string contentType,
        uint256 price
    );

    event ContentPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );

    constructor() ERC721("ChainMuse Creator Content", "CMC") {}

    function mintContent(
        string memory ipfsHash,
        string memory contentType,
        string memory license,
        uint256 price,
        uint256 royaltyPercentage,
        bool isExclusive
    ) external returns (uint256) {
        require(royaltyPercentage <= 25, "Royalty percentage too high");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);

        contents[newTokenId] = Content({
            ipfsHash: ipfsHash,
            contentType: contentType,
            license: license,
            price: price,
            creator: msg.sender,
            royaltyPercentage: royaltyPercentage,
            isExclusive: isExclusive
        });

        creatorContents[msg.sender].push(newTokenId);

        emit ContentMinted(newTokenId, msg.sender, contentType, price);

        return newTokenId;
    }

    function purchaseContent(uint256 tokenId) external payable nonReentrant {
        Content memory content = contents[tokenId];
        require(msg.value >= content.price, "Insufficient payment");
        require(_exists(tokenId), "Content does not exist");

        address seller = ownerOf(tokenId);
        require(seller != msg.sender, "Cannot buy your own content");

        // Calculate royalty
        uint256 royaltyAmount = (msg.value * content.royaltyPercentage) / 100;
        uint256 sellerAmount = msg.value - royaltyAmount;

        // Transfer royalty to creator
        (bool royaltySent,) = content.creator.call{value: royaltyAmount}("");
        require(royaltySent, "Failed to send royalty");

        // Transfer remaining amount to seller
        (bool sellerPaid,) = seller.call{value: sellerAmount}("");
        require(sellerPaid, "Failed to pay seller");

        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);

        emit ContentPurchased(tokenId, msg.sender, seller, msg.value);
    }

    function getContent(uint256 tokenId) external view returns (Content memory) {
        require(_exists(tokenId), "Content does not exist");
        return contents[tokenId];
    }

    function getCreatorContents(address creator) external view returns (uint256[] memory) {
        return creatorContents[creator];
    }
}