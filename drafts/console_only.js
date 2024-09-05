// Source, to help with console-only setting structure and logic: https://replit.com/@40percentzinc/ConnectFourConsole#script.js

function Player(symbol, name) {
  this.symbol = symbol;
  this.name = name;

  const getPlayerSymbol = () => {
    return this.symbol;
  };

  const getPlayerName = () => {
    return this.name;
  };

  const setPlayerName = (input) => {
    this.name = input;
  };

  return { getPlayerSymbol, getPlayerName, setPlayerName };
}

const gameBoard = () => {
  const board = [];
  for (let i = 0; i <= 8; i++) {
    board.push(square());
  }

  const getBoard = () => {
    return board;
  };

  let isMoveValid = true;

  const getIsMoveValid = () => {
    return isMoveValid;
  }

  const dropSymbol = (squareIndex, player) => {
    if (squareIndex > board.length) {
      isMoveValid = false;
      console.log("Actually they can't! It's not a valid square. Try again.");
      return;
    }
    if (board[squareIndex].getValue() !== "") {
      isMoveValid = false;
      console.log("Actually they can't! The square is not empty. Try again.");
      return;
    }
    isMoveValid = true;
    board[squareIndex].addSymbol(player);
  };

  const printBoard = () => {
    let output = "";
    for (let i = 0; i < board.length; i++) {
      output += board[i].getValue() ? board[i].getValue() : "-";
      if ((i + 1) % 3 !== 0) {
        output += " | ";
      } else if (i < 8) {
        output += "\n---------\n";
      }
    }
    console.log(output);
  };

  return { getBoard, dropSymbol, printBoard, getIsMoveValid };
};

const square = () => {
  let value = "";

  const addSymbol = (player) => {
    value = player.getPlayerSymbol();
  };

  const getValue = () => {
    return value;
  };

  return { addSymbol, getValue };
};

const gameController = (() => {
  const board = gameBoard();

  const playerX = new Player("X", "Player 1");
  const playerO = new Player("O", "Player 2");
  let round = 1;
  let gameFinished = false;

  let activePlayer = playerX;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === playerX ? playerO : playerX;
  };

  const getActivePlayer = () => {
    return activePlayer;
  };

  const printNewRound = () => {
    board.printBoard();
  };

  const playRound = (squareInput) => {

    const checkWin = () => {
      const winCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
  
      const isGameWon = winCombinations
        .filter((combination) => combination.includes(squareInput))
        .some((validCombination) =>
          validCombination.every(
            (index) => board.getBoard()[index].getValue() === activePlayer.getPlayerSymbol()
          )
        );
      
      return isGameWon;
    };

    console.log(`Round ${round} - ${activePlayer.getPlayerName()}'s turn.`);
    console.log(
      `${activePlayer.getPlayerName()} places their symbol in square #${squareInput}.`
    );

    board.dropSymbol(Number(squareInput), activePlayer);

    if (!board.getIsMoveValid()) {
      return;
    }

    if (checkWin(squareInput)) {
      console.log(`${activePlayer.getPlayerName()} won!`);
      gameFinished = true;
      return;
    }

    console.log(checkWin(squareInput));

    if (round === 9) {
      console.log(`No one won! It's a draw!`);
      gameFinished = true;
      return;
    }

    round++;
    switchPlayerTurn();
  };

  const getIsGameFinished = () => {
    return gameFinished;
  }

  return { playRound, printNewRound, getActivePlayer, getIsGameFinished, switchPlayerTurn };
})();

// Playing some rounds in console to test

gameController.printNewRound();
gameController.playRound(4);

gameController.printNewRound();
gameController.playRound(1);

gameController.printNewRound();
gameController.playRound(1);

gameController.printNewRound();
gameController.playRound(0);

gameController.printNewRound();
gameController.playRound(6);

gameController.printNewRound();
gameController.playRound(8);