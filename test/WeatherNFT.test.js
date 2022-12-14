const { expect } = require("chai");
const { ethers } = require("hardhat");

let deployer, owner1;
let Token, tokenContract;
let TOKEN_ID_0, TOKEN_ID_1;

before(async () => {
    const updateInterval = 10;
    const _link = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';
    const _oracle = '0xB9756312523826A566e222a34793E414A81c88E1';

    [deployer, owner1] = await ethers.getSigners();
    Token = await ethers.getContractFactory("WeatherNFT");
    tokenContract = await Token.deploy(updateInterval, _link, _oracle, { gasLimit: 3000000 });

    TOKEN_ID_0 = 0;
    TOKEN_ID_1 = 1;
});

describe("Test WeatherNFT", () => {
    it("Should deploy WeatherNFT token contract correctly", async () => {
        await tokenContract.deployed();

        const bigNum = await tokenContract.totalSupply();

        expect(bigNum).to.equal(0);

        expect(await tokenContract.owner()).to.equal(deployer.address);
        expect(await tokenContract.balanceOf(deployer.address)).to.equal(0);

        await expect(tokenContract.ownerOf(TOKEN_ID_0)).to.be.revertedWith(
            "ERC721: owner query for nonexistent token"
        );
        await expect(tokenContract.tokenURI(TOKEN_ID_0)).to.be.revertedWith(
            "ERC721URIStorage: URI query for nonexistent token"
        );
    });

    it("should mint token correctly", async () => {
        const mintTx = await tokenContract.safeMint(owner1.address);
        await mintTx.wait(1);

        expect(await tokenContract.ownerOf(TOKEN_ID_0)).to.equal(owner1.address);
        expect(await tokenContract.tokenURI(TOKEN_ID_0)).to.include(
            "filename=slightly-smiling-face.json"
        );

        await expect(tokenContract.tokenURI(TOKEN_ID_1)).to.be.revertedWith(
            "ERC721URIStorage: URI query for nonexistent token"
        );
    });
});