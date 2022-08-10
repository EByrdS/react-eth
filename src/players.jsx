import { ethers } from "ethers";
import { provider } from "./eth_connection.jsx";

const player1 = new ethers.Wallet("0xa6dd99438292bad910bfccf3269aa8de472c84206d90fbfc80cf2ff4a071e91a", provider);
const player2 = new ethers.Wallet("0x96b2e2a14563efb23780527030a90b146167406d820f06a1072cbbba519ed368", provider);

export { player1, player2 };
