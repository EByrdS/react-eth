import { Interface } from "ethers/lib/utils";

const tokenAbi = new Interface([
    "function mintTTT(address to, uint256 amount) external",
]);

const nftAbi = new Interface([
    "function mint(address to, uint256 tokenId) external",
    "function tokenURI(uint256 tokenId) public view override returns (string memory)",
    "function metadataJSON(uint256 gameId, string[9] memory board) public view returns (string memory)",
    "function metadataURI(uint256 gameId) public view returns (string memory)",
    "function imageURI(string[9] memory board) public pure returns (string memory)",
    "function boardSVG(string[9] memory board) public pure returns (string memory)"
]);

const tttAbi = new Interface([
    // general
    "function gameIdByTokenId(uint256 tokenId) external view returns (uint256)",
    "function board(uint256 gameId) external view returns (string[9] memory)",
    "function isTurnX(uint256 gameId) public view returns(bool)",
    "function claimStake(uint256 gameId) public payable",
    "function recoverFees() public payable",
    "function gameStake(uint256 gameId) external view returns(uint256)",
    // game
    "function newGameAsX() external payable returns (uint256)",
    "function newGameAsO() external payable returns (uint256)",
    "function stakeAndJoin(uint256 gameId) public payable",
    "function move(uint256 gameId, uint8 cellIndex) public payable",
    // events
    "event NewGame(uint256 indexed gameId, bool playerO, address playerAddress, uint256 initialStake)",
    "event Move(uint256 indexed gameId, bool playerO, uint8 position)",
    "event Staked(uint256 indexed gameId, bool playerO, address playerAddress, uint amount)",
    "event Won(uint256 indexed gameId, address playerAddress, uint amount)"
]);

// const Token = new ethers.Contract(TokenAddress, tokenAbi, provider);
// const NFT = new ethers.Contract(NFTAddress, nftAbi, provider);
// const TicTacToken = new ethers.Contract(TTTAddress, tttAbi, provider);

// export { Token, NFT, TicTacToken };
export { tokenAbi, nftAbi, tttAbi };
