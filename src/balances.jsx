import React from "react";
import { signer, provider } from "./eth_connection.jsx";
import { TTTAddress } from "./addresses.jsx";
import { player1, player2 } from "./players.jsx";

const defaultAddress = await signer.getAddress();
const defaultAddressBalance = (await signer.getBalance()).toString();

const player1Address = await player1.getAddress();
const player1Balance = (await player1.getBalance()).toString();

const player2Address = await player2.getAddress();
const player2Balance = (await player2.getBalance()).toString();

const tttBalance = (await provider.getBalance(TTTAddress)).toString();

const Balances = () => {
    return (
        <div>
            <p>
                Balances
            </p>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Default</td>
                            <td>{defaultAddress}</td>
                            <td>{defaultAddressBalance}</td>
                        </tr>
                        <tr>
                            <td>Player 1</td>
                            <td>{player1Address}</td>
                            <td>{player1Balance}</td>
                        </tr>
                        <tr>
                            <td>Player 2</td>
                            <td>{player2Address}</td>
                            <td>{player2Balance}</td>
                        </tr>
                        <tr>
                            <td>TicTactoken</td>
                            <td>{TTTAddress}</td>
                            <td>{tttBalance}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Balances;
