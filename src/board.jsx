
import React, { useState, useEffect }  from "react";
import { useParams } from "react-router-dom";
import { signer, provider } from "./eth_connection.jsx";
import { TTTAddress } from "./addresses";
import { tttAbi } from "./abi.jsx";
import { ethers } from "ethers";
import { player1, player2 } from "./players.jsx";

const TicTacToken = new ethers.Contract(TTTAddress, tttAbi, signer);

const TTTCell = (props) => {
    const [isHovering, changeHovering] = useState(false);
    
    return (
        <div>
            <button
                onMouseOver={() => changeHovering(true)} 
                onMouseLeave={() => changeHovering(false)}
                onClick={() => props.onClickHandler(props.cellIndex)}
                style={{backgroundColor: isHovering ? "green" : ""}}>
                {isHovering ? props.hoverCharacter : props.mark}
            </button>
        </div>
    )
}

const player1Address = await player1.getAddress();
const player2Address = await player2.getAddress();

const player1TTT = new ethers.Contract(TTTAddress, tttAbi, player1);
const player2TTT = new ethers.Contract(TTTAddress, tttAbi, player2);

class Board extends React.Component {
    state = {
        xTurn: true,
        shownAddress: null,
        hoverCharacter: "X",
        playerAddress: player1Address,
        boardIsTurnX: true,
        stake: 0,
        board: [],
        newGameEvents: [],
        stakedEvents: [],
        moveEvents: [],
        wonEvents: []
    }

    constructor(props) {
        super(props);
        console.log("Board game id ", props.gameid);
        this.changePlayer = this.changePlayer.bind(this);
        this.cellClick = this.cellClick.bind(this);

        const newGameEvent = {
            address: TTTAddress,
            topics: [
                ethers.utils.id("NewGame(uint256,bool,address,uint256)"),
                ethers.utils.hexZeroPad(parseInt(props.gameid), 32)
            ]
        }

        const stakedEvent = {
            address: TTTAddress,
            topics: [
                ethers.utils.id("Staked(uint256,bool,address,uint256)"),
                ethers.utils.hexZeroPad(parseInt(props.gameid), 32)
            ]
        }

        const moveEvent = {
            address: TTTAddress,
            topics: [
                ethers.utils.id("Move(uint256,bool,uint8)"),
                ethers.utils.hexZeroPad(parseInt(props.gameid), 32)
            ]
        }

        const wonEvent = {
            address: TTTAddress,
            topics: [
                ethers.utils.id("Won(uint256,address,uint256)"),
                ethers.utils.hexZeroPad(parseInt(props.gameid), 32)
            ]
        }
        
        TicTacToken.on(newGameEvent, this.addNewGameEvent);
        TicTacToken.on(stakedEvent, this.addStakedEvent);
        TicTacToken.on(moveEvent, this.addMoveEvent);
        TicTacToken.on(wonEvent, this.addWonEvent);
    }

    addNewGameEvent = (_, isPlayerX, playerAddress, amount, element) => {
        this.setState({
            newGameEvents: [...this.state.newGameEvents, {
                side: isPlayerX ? "X" : "O",
                address: playerAddress,
                amount: amount.toString(),
                transactionHash: element.transactionHash
            }]
        })
        this.update();
    }

    addStakedEvent = (_, isPlayerX, playerAddress, amount, element) => {
        this.setState({
            stakedEvents: [...this.state.stakedEvents, {
                side: isPlayerX ? "X" : "O",
                address: playerAddress,
                amount: amount.toString(),
                transactionHash: element.transactionHash
            }]
        })
        this.update();
    }

    addMoveEvent = (_, isPlayerO, position, element) => {
        this.setState({
            moveEvents: [...this.state.moveEvents, {
                mark: isPlayerO ? "O" : "X", 
                position: position,
                transactionHash: element.transactionHash
            }]
        })
        this.update();
    }

    addWonEvent = (_, playerAddress, amount, element) => {
        this.setState({
            wonEvents: [...this.state.wonEvents, {
                address: playerAddress,
                prize: amount.toString(),
                transactionHash: element.transactionHash
            }]
        })
        this.update();
    }

    update = () => {
        console.log("Updating")
        TicTacToken.board(this.props.gameid).then(
            board => {
                this.setState({board})
            }
        );
        TicTacToken.isTurnX(this.props.gameid).then(
            boardIsTurnX => {
                this.setState({boardIsTurnX})
            }
        )
        TicTacToken.gameStake(this.props.gameid).then(
            stake => {
                this.setState({stake: stake.toString()})
            }
        )
    }

    componentDidMount() {
        this.update();
    }

    changePlayer(isXPlayer) {
        this.setState({
            xTurn: isXPlayer, 
            hoverCharacter: isXPlayer ? "X" : "O",
            playerAddress: isXPlayer ? player1Address : player2Address
        });
    }

    cellClick(cellIndex) {
        let playerHandler = this.state.xTurn ? player1TTT : player2TTT;
        playerHandler.move(this.props.gameid, cellIndex);
    }

    claimRewardAsPlayer1 = () => {
        player1TTT.claimStake(this.props.gameid).then(this.update);
    }

    claimRewardAsPlayer2 = () => {
        player2TTT.claimStake(this.props.gameid).then(this.update);
    }

    collectFees = () => {
        TicTacToken.recoverFees().then(this.update);
    }

    render() {
        const newGameEventsItems = this.state.newGameEvents.map((element) => {
            return (
                <li key = {element.transactionHash}>
                    {element.side} {element.address} {element.amount}
                </li>
            )
        })
        const stakedEventsItems = this.state.stakedEvents.map((element) => {
            return (
                <li key = {element.transactionHash}>
                    {element.side} {element.address} {element.amount}
                </li>
            );
        })
        const moveEventsItems = this.state.moveEvents.map((element) => {
            return (
                <li key={element.transactionHash}>
                    {element.mark} {element.position}
                </li>
            );
        })
        const wonEventsItems = this.state.wonEvents.map((element) => {
            return (
                <li key={element.transactionHash}>
                    {element.address} {element.prize}
                </li>
            );
        })

        return (
            <div>
                <p>Game #{this.props.gameid}, Stake: {this.state.stake}</p>
                <p>Board turn is {this.state.boardIsTurnX ? "X" : "O"}</p>
                <table>
                    <tbody>
                        <tr>
                            <td><TTTCell mark={this.state.board[0]} cellIndex={0}
                                hoverCharacter={this.state.hoverCharacter}
                                onClickHandler={this.cellClick}/></td>
                            <td><TTTCell mark={this.state.board[1]} cellIndex={1}
                                hoverCharacter={this.state.hoverCharacter}
                                onClickHandler={this.cellClick}/></td>
                            <td><TTTCell mark={this.state.board[2]} cellIndex={2}
                                hoverCharacter={this.state.hoverCharacter}
                                onClickHandler={this.cellClick}/></td>
                        </tr>
                        <tr>
                            <td><TTTCell mark={this.state.board[3]} cellIndex={3}
                                hoverCharacter={this.state.hoverCharacter}
                                onClickHandler={this.cellClick}/></td>
                            <td><TTTCell mark={this.state.board[4]} cellIndex={4}
                                hoverCharacter={this.state.hoverCharacter}
                                onClickHandler={this.cellClick}/></td>
                            <td><TTTCell mark={this.state.board[5]} cellIndex={5}
                                hoverCharacter={this.state.hoverCharacter}
                                onClickHandler={this.cellClick}/></td>
                        </tr>
                        <tr>
                            <td><TTTCell mark={this.state.board[6]} cellIndex={6}
                                hoverCharacter={this.state.hoverCharacter}
                                onClickHandler={this.cellClick}/></td>
                            <td><TTTCell mark={this.state.board[7]} cellIndex={7}
                                hoverCharacter={this.state.hoverCharacter}
                                onClickHandler={this.cellClick}/></td>
                            <td><TTTCell mark={this.state.board[8]} cellIndex={8}
                                hoverCharacter={this.state.hoverCharacter}
                                onClickHandler={this.cellClick}/></td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={() => this.changePlayer(!this.state.xTurn)}>
                    Play as {this.state.xTurn ? "O" : "X"} (currently {this.state.xTurn ? "X" : "O" })
                </button>
                <p>
                    Current player {this.state.xTurn ? "X" : "O"} address: {this.state.playerAddress}
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>New Game</th>
                            <th>Stakings</th>
                            <th>Movements</th>
                            <th>Won</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><ol>{newGameEventsItems}</ol></td>
                            <td><ol>{stakedEventsItems}</ol></td>
                            <td><ol>{moveEventsItems}</ol></td>
                            <td><ol>{wonEventsItems}</ol></td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <button onClick={this.claimRewardAsPlayer1}>
                        Claim for Player 1
                    </button>
                    <button onClick={this.claimRewardAsPlayer2}>
                        Claim for Player 2
                    </button>
                    <button onClick={this.collectFees}>
                        Collect Fees
                    </button>
                </div>
            </div>
        )
    }
}

export default Board;
