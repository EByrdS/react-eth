import React from "react";
import { signer } from "./eth_connection";
import { useNavigate } from "react-router-dom";
import { TTTAddress } from "./addresses";
import { tttAbi } from "./abi.jsx";
import { player1, player2 } from "./players.jsx";
import { ethers } from "ethers";

const TicTacToken = new ethers.Contract(TTTAddress, tttAbi, signer);

const player1TTT = new ethers.Contract(TTTAddress, tttAbi, player1);
const player2TTT = new ethers.Contract(TTTAddress, tttAbi, player2);

const GameCreator = () => {
    let stakeTransaction = null;
    const newGameEvents = [];
    let navigate = useNavigate();

    const stakeOption = { value: ethers.utils.parseEther("0.001") };

    const newGameEvent = {
        address: TTTAddress,
        topics: [
            ethers.utils.id("NewGame(uint256,bool,address,uint256)"),
        ]
    }
    TicTacToken.on(newGameEvent, addNewGameEvent);

    function addNewGameEvent(gameid, isPlayerX, playerAddress, amount, element) {
        newGameEvents.push({
            gameid: gameid,
            side: isPlayerX ? "X" : "O",
            address: playerAddress,
            amount: amount.toString(),
            transactionHash: element.transactionHash
        })
        if (stakeTransaction && stakeTransaction.hash == element.transactionHash) {
            console.log("Trying to join staked game: ", gameid.toString());
            player2TTT.stakeAndJoin(gameid.toString(), stakeOption).then(
                () => {
                    console.log("Trying to navigate to such game id");
                    navigate("/" + gameid.toString());
                }
            )
        }
        console.log(newGameEvents);
    }

    function stakeAndJoin() {
        console.log("Trying to create a new game as X");
        player1TTT.newGameAsX(stakeOption).then(
            transaction => {
                stakeTransaction = transaction;
            }
        )
    }

    return (
        <button onClick={stakeAndJoin}>
            Stake and Join new game
        </button>
    )
}

export default GameCreator;
