import React, { useState, useEffect } from "react";
import { signer } from "./eth_connection.jsx";
import { nftAbi } from "./abi.jsx";
import { NFTAddress } from "./addresses";
import { ethers } from "ethers";

const NFTContract = new ethers.Contract(NFTAddress, nftAbi, signer);

const NFT = (props) => {
    const [nftURI, setNFTURI] = useState("");
    const [nftData, setNFTData] = useState({});

    function updateNFTURI() {
        NFTContract.metadataURI(props.gameid).then(
            receivedNFTURI => {
                setNFTURI(receivedNFTURI);
            }
        );
    }

    useEffect(() => {
        updateNFTURI();
    }, [props.gameid]);

    useEffect(() => {
        fetch(nftURI).then(
            response => {
                response.json().then(
                    data => {
                        setNFTData(data);
                    }
                )
            }
        )
    }, [nftURI]);

    // let nftURI = await NFTContract.metadataURI(props.gameid);
    return (
        <div>
            <div>
                <p>
                    NFT metadataURI({props.gameid}):
                </p>
                {nftURI}
            </div>
            <div>
                <p>NFT name: {nftData.name}</p>
                <p>NFT Description: {nftData.description}</p>
            </div>
            <div>
                <p>
                    NFT SVG:
                </p>
                <img src={nftData.image} height="150px"></img>
            </div>
        </div>
    )
}

export default NFT;
