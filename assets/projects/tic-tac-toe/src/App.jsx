import { useCallback, useEffect, useState } from "react";
import Square from "./Square";

const INITIAL_GAME_STATE = ["", "", "", "", "", "", "", "", ""];
const INITIAL_SCORES = { X: 0, O: 0 };
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [currentPlayer, setCurrentPlayer] = useState("X");
    const [lastPlayer, setLastPlayer] = useState("");
  const [scores, setScores] = useState(INITIAL_SCORES);

  useEffect(() => {
    const storedScores = localStorage.getItem("scores");
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
  }, []);

  const handleWin = useCallback(() => {
    alert(`Congrats player ${lastPlayer} !`);
    setScores((prevScores) => {
      const newScores = {
        ...prevScores,
        [lastPlayer]: prevScores[lastPlayer] + 1,
      };
      localStorage.setItem("scores", JSON.stringify(newScores));
      return newScores;
    });
    setGameState(INITIAL_GAME_STATE);
  }, [lastPlayer]);

  const handleDraw = useCallback(() => {
    alert("Draw!");
    setGameState(INITIAL_GAME_STATE);
  }, []);

  const changePlayer = useCallback(() => {
    setCurrentPlayer((prevPlayer) => (prevPlayer === "X" ? "O" : "X"));
  }, []);

  const checkForWinner = useCallback(() => {
    for (let i = 0; i < WINNING_COMBOS.length; i++) {
      const [a, b, c] = WINNING_COMBOS[i].map((index) => gameState[index]);
      if (a && a === b && b === c) {
        setTimeout(handleWin, 200);
        return;
      }
    }

    if (!gameState.includes("")) {
      setTimeout(handleDraw, 200);
    }
  }, [gameState, handleWin, handleDraw]);

  useEffect(() => {
    checkForWinner();
  }, [gameState, checkForWinner]);

  const handleCellClick = (index) => {
    if (gameState[index]) return;
    const newGameState = [...gameState];
    newGameState[index] = currentPlayer;
    setGameState(newGameState);
    setLastPlayer(currentPlayer);
    changePlayer();
  };
  return (
    <div className="container">
      <div className="title">
        <h1>Tic Tac Toe Game</h1>
      </div>
      <div className="game-container">
        <div className="grid-layout">
          {gameState.map((player, index) => (
            <Square
              key={index}
              onClick={() => handleCellClick(index)}
              index={index}
              player={player}
            />
          ))}
        </div>
      </div>
      <div className="content">
        <div className="players">
          <p>
            Next Player: <span>{currentPlayer}</span>
          </p>
        </div>
        <div className="player1">
          <p>Player X</p>
          <span>{scores["X"]}</span>
        </div>
        <div className="player2">
          <p>Player O</p>
          <span>{scores["O"]}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
