// PLAYER
// Object constructor
function Player(symbol) {
  this.symbol = symbol;

  const getSymbol = () => {
    return this.symbol;
  };

  return { getSymbol };
}

// BOARD
// IIFE

const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const setSquare = (index, symbol) => {
    if (index > board.length) return;
    board[index] = symbol;
  };

  const getSquare = (index) => {
    if (index > board.length) return;
    return board[index];
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { setSquare, getSquare, reset };
})();

// UI MODULE
// IIFE
const uiModule = (() => {
  const squareEls = document.querySelectorAll(".square");
  const messageEl = document.querySelector("#message");

  squareEls.forEach((square) => {
    square.addEventListener("click", (e) => {
      if (gameModule.getGameFinished() || e.target.textContent !== "") return;
      gameModule.playRound(parseInt(e.target.dataset.id));
      updateBoard();
    });

    square.addEventListener("mouseover", (e) => {
      if (gameModule.getGameFinished()) return;
      if (e.target.textContent === "") {
        e.target.classList.add("square-possible");
      }
    });

    square.addEventListener("mouseout", (e) => {
      e.target.classList.remove("square-possible");
    });
  });

  const updateBoard = () => {
    for (let i = 0; i < squareEls.length; i++) {
      squareEls[i].textContent = gameBoard.getSquare(i);
    }
  };

  const displayMessage = (message) => {
    messageEl.textContent = message;
  };

  const displayEndResult = (winner) => {
    if (winner === "draw") {
      displayMessage("It's a draw!");
    } else {
      displayMessage(`Player ${winner} has won!`);
    }
  };

  return { displayMessage, displayEndResult };
})();

// GAME MODULE
// IIFE

const gameModule = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let round = 1;
  let gameFinished = false;

  const getCurrentSymbol = () => {
    return round % 2 === 1 ? playerX.getSymbol() : playerO.getSymbol();
  };

  const playRound = (latestSquare) => {
    const checkWin = (latestSquare) => {
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
        .filter((combination) => combination.includes(latestSquare))
        .some((validCombination) =>
          validCombination.every(
            (index) => gameBoard.getSquare(index) === getCurrentSymbol()
          )
        );
      return isGameWon;
    };

    gameBoard.setSquare(latestSquare, getCurrentSymbol());

    if (checkWin(latestSquare)) {
      uiModule.displayEndResult(getCurrentSymbol());
      gameFinished = true;
      return;
    }

    if (round === 9) {
      uiModule.displayEndResult("draw");
      gameFinished = true;
      return;
    }

    round++;

    uiModule.displayMessage(
      `Round ${round} - Player ${getCurrentSymbol()}'s turn!`
    );
  };

  const getGameFinished = () => {
    return gameFinished;
  };

  const resetGame = () => {
    round = 1;
    gameFinished = false;
  };

  return { playRound, getGameFinished, resetGame };
})();
