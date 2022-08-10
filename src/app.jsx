import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";
import Balances from "./balances.jsx";
import NFT from "./nft.jsx";
import Board from "./board.jsx";
import GameCreator from "./game-creator.jsx";

function Web3(props) {
  const [gameId, setGameId] = useState(props?.match?.params?.gameid);

  const didFocusSubscription = props.navigation.addListener(
    'focus',
    () => {
      let { newGameId } = useParams();
      setGameId(newGameId)
    }
  )

  return (
    <div>
      <Board gameid={gameId}/>
      <NFT gameid={gameId}/>
    </div>
  )
}

const App = (props) => {
  return (
    <Router>
      <div>
          <h1>
              TicTacToken
          </h1>
          <div>
              by Emmanuel Byrd
          </div>
          <Balances/>
          <GameCreator/>
          <Routes>
            <Route path="/">
              <Route path=":gameid" element={<Web3/>}/>
            </Route>
          </Routes>
      </div>
    </Router>
  )
}

export default App;
