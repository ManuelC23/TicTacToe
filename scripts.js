const Player = (id, mark) => {
  return { id, mark };
};

const gameBoard = (() => {
  // Module used to create and render the gameboard.

  const boardArray = [];

  for (let i = 0; i < 9; i++) {
    // This for-loop is used to fill the board with nine empty spaces when the website loads.
    boardArray.push(undefined);
  }

  const clearArray = () => {
    // Function used to clear the array.
    for (let i = 0; i < 9; i++) {
      boardArray[i] = undefined;
    }
  };

  const gameBoardSelector = document.getElementById("gameboard"); // Selects the div where the gamebaord will be rendered.

  boardArray.forEach(() => {
    // This for-each loop is used to render the board.
    const square = document.createElement("div");
    square.className = "square";
    gameBoardSelector.appendChild(square);
  });

  const getBoardArray = () => boardArray; // Function used to return the boardArray
  const checkForWin = () => {}; // Function used to check if there's a winner
  return { getBoardArray, checkForWin, clearArray };
})();

const startGame = (() => {
  // Module used to start a new game.
  const gameboard = gameBoard;
  const clearBoard = () => {
    gameboard.clearArray();
    updateGameBoard();
  };

  return { clearBoard };
})();

function updateGameBoard() {
  // Function used to update the gameboard everytime a player adds a mark
  const boardArray = gameBoard;

  const squareSelector = document.querySelectorAll(".square"); //
  squareSelector.forEach((square, index) => {
    square.textContent = boardArray.getBoardArray()[index];
  });
}

function addMark(playerId) {
  // Function used to add a mark in the board
  const squares = document.querySelectorAll(".square");
  const boardArray = gameBoard;

  squares.forEach((square, index) => {
    if (boardArray.getBoardArray()[index] === undefined) {
      // This code checks if a position is empty and then allows a player add a mark.
      square.addEventListener("click", () => {
        if (playerId === 1) {
          boardArray.getBoardArray()[index] = "x";
          console.log(boardArray.getBoardArray());
          updateGameBoard();
        }
        if (playerId === 2) {
          boardArray.getBoardArray()[index] = "y";
          console.log(boardArray.getBoardArray());
          updateGameBoard();
        }
      });
    }
  });
}
