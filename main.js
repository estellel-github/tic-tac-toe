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

const gameBoard = (() => {
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
  };

  const dropSymbol = (squareIndex, player) => {
    if (squareIndex > board.length || board[squareIndex].getValue() !== "") {
      isMoveValid = false;
      return;
    }
    isMoveValid = true;
    board[squareIndex].addSymbol(player);
  };

  return { getBoard, dropSymbol, getIsMoveValid };
})();

const uiController = (() => {
  const squareEls = document.querySelectorAll(".square");
  const messageEl = document.querySelector("#message");

  const updateBoard = () => {
    for (let i = 0; i < squareEls.length; i++) {
      squareEls[i].textContent = gameBoard.getBoard()[i].getValue();
    }
  };

  squareEls.forEach((square) => {
    square.addEventListener("click", (e) => {
      if (gameController.getIsGameFinished()) return;
      gameController.playRound(parseInt(e.target.dataset.id));
      updateBoard();
    });

    square.addEventListener("mouseover", (e) => {
      if (gameController.getIsGameFinished()) return;
      if (e.target.textContent === "") {
        e.target.classList.add("square-possible");
      }
    });

    square.addEventListener("mouseout", (e) => {
      e.target.classList.remove("square-possible");
    });
  });

  const displayRoundMessage = (round, activePlayer) => {
    messageEl.textContent = `Round ${round} - ${activePlayer.getPlayerName()}'s turn.\nPlace the ${activePlayer.getPlayerSymbol()} symbol on an empty square!`;
  };

  const displayEndResult = (winner) => {
    if (winner === "draw") {
      messageEl.textContent = "The board is full and no one won!\nIt's a draw!";
    } else {
      messageEl.textContent = winner.getPlayerSymbol() + `🏅 ${winner.getPlayerName()} has won!`;
    }
  };

  return { updateBoard, displayRoundMessage, displayEndResult };
})();

const gameController = (() => {
  const playerX = new Player("🐱", "Cat");
  const playerO = new Player("🐁", "Mouse");
  let round = 1;
  let gameFinished = false;

  let activePlayer = playerX;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === playerX ? playerO : playerX;
  };

  uiController.displayRoundMessage(round, activePlayer);

  const playRound = (squareInput) => {
    uiController.updateBoard();

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
            (index) =>
              gameBoard.getBoard()[index].getValue() ===
              activePlayer.getPlayerSymbol()
          )
        );

      return isGameWon;
    };

    uiController.displayRoundMessage(round, activePlayer);

    gameBoard.dropSymbol(Number(squareInput), activePlayer);

    if (!gameBoard.getIsMoveValid()) {
      return;
    }

    uiController.updateBoard();

    if (checkWin(squareInput)) {
      uiController.displayEndResult(activePlayer);
      gameFinished = true;
      return;
    }

    console.log(checkWin(squareInput));

    if (round === 9) {
      uiController.displayEndResult("draw");
      gameFinished = true;
      return;
    }

    round++;
    switchPlayerTurn();
    uiController.displayRoundMessage(round, activePlayer);
  };

  const getIsGameFinished = () => {
    return gameFinished;
  };

  const startNewGame = () => {
    round = 1;
    gameFinished = false;
  };

  return {
    playRound,
    getIsGameFinished,
    startNewGame,
  };
})();
