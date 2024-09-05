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
  };

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

  return { getBoard, dropSymbol, getIsMoveValid };
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

const uiController = (() => {
  const squareEls = document.querySelectorAll(".square");
  const messageEl = document.querySelector("#message");

  const updateBoard = () => {
    for (let i = 0; i < squareEls.length; i++) {
      squareEls[i].textContent = board[i].getValue(); // RECHECK???
    }
  };

  squareEls.forEach((square) => {
    square.addEventListener("click", (e) => {
      if (gameController.getGameIsFinished()) return;
      gameController.playRound(parseInt(e.target.dataset.id));
      updateBoard(); // RECHECK???
    });

    square.addEventListener("mouseover", (e) => {
      if (gameController.getGameIsFinished()) return;
      if (e.target.textContent === "") {
        e.target.classList.add("square-possible");
      }
    });

    square.addEventListener("mouseout", (e) => {
      e.target.classList.remove("square-possible");
    });
  });

  const displayRoundMessage = (round, activePlayer) => {
    messageEl.textContent = `Round ${round} - ${activePlayer.getPlayerName}'s turn.`;
  };

  const displayEndResult = (winner) => {
    if (winner === "draw") {
      displayMessage("The board is full and no one won! It's a draw!");
    } else {
      displayMessage(`${winner.getPlayerName()} has won!`);
    }
  };

  return { displayRoundMessage, displayEndResult };
})();

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
              board.getBoard()[index].getValue() ===
              activePlayer.getPlayerSymbol()
          )
        );

      return isGameWon;
    };

    uiController.displayMessage(round, activePlayer);

    board.dropSymbol(Number(squareInput), activePlayer);

    if (!board.getIsMoveValid()) {
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
    startNewGame
  };
})();
