const Player = (name, position = undefined, mark) => {
  return {
    name,
    position,
    mark,
  };
};

const gameBoard = (() => {
  // Module used to create the gameboard.
  const board = ["", "", "", "", "", "", "", "", ""];

  const clearBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  const getBoard = () => board;

  const printBoard = () => {
    console.log(board[0] + "|" + board[1] + "|" + board[2]);
    console.log(board[3] + "|" + board[4] + "|" + board[5]);
    console.log(board[6] + "|" + board[7] + "|" + board[8]);
  };

  const addMark = (position, mark) => {
    board[position] = mark;
    printBoard();
    displayController.updateBoard(gameBoard.getBoard());
  };

  return { clearBoard, printBoard, addMark, getBoard };
})();

function gameController(Player1Name, Player2Name) {
  const newGame = gameBoard;
  const display = displayController;
  newGame.clearBoard();

  const Player1 = Player(Player1Name, undefined, "X");
  const Player2 = Player(Player2Name, undefined, "O");
  let i = 0;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function checkWinner(array, winningCombinations) {
    // Function used to verify if any of the players won the game.
    for (let i = 0; i < array.length; i++) {
      // For-loop used to iterate the board array
      if (array[i] !== "") {
        // If used to check if there is a mark on the position
        for (let j = 0; j < winningCombinations.length; j++) {
          // For-loop used to check the winning combinations
          if (winningCombinations[j][0] === i) {
            // If used to check if the condition starts with the marked number
            if (
              // If used to verify if the squares are forming three in row
              array[i] === array[winningCombinations[j][1]] &&
              array[i] === array[winningCombinations[j][2]]
            ) {
              return true;
            }
          }
        }
      }
    }
  }

  async function checkPosition(position, array, player) {
    // Function to check if a position is taken or available.
    if (array[position] === "") {
      // In case a position is empty, the function adds a Mark to the position.
      newGame.addMark(position, player.mark);
    } else {
      // If the position is taken, another position is requested and the code execution stops until a valid position is entered.
      let newPosition = position;
      while (array[newPosition] !== "") {
        console.log(array[newPosition] !== "");
        newPosition = await display.getPosition();
      }
      newGame.addMark(newPosition, player.mark);
    }
  }

  async function playRound() {
    // Function used to play a round of the game. Async is used because we will need to wait for the players to click.
    let position;
    while (i < 9) {
      position = await display.getPosition(); //
      await checkPosition(position, newGame.getBoard(), Player1);
      if (checkWinner(newGame.getBoard(), winningCombinations)) {
        console.log(`${Player1.name} won the game`);
        newGame.clearBoard();
        break;
      }
      i++;
      if (i === 9) {
        console.log("Draw!");
        break;
      }
      position = await display.getPosition();
      await checkPosition(position, newGame.getBoard(), Player2);
      if (checkWinner(newGame.getBoard(), winningCombinations)) {
        console.log(`${Player2.name} won the game`);
        newGame.clearBoard();
        break;
      }
      i++;
    }
  }

  playRound();
  display.updateBoard(newGame.getBoard());
}

const displayController = (() => {
  const gameBoardDiv = document.getElementById("gameboard");

  function drawBoard(gameBoard) {
    // Function used to draw the initial empty gameBoard;
    gameBoard.getBoard().forEach((element) => {
      const squareDiv = document.createElement("div");
      squareDiv.className = "square";
      squareDiv.innerText = element;
      gameBoardDiv.appendChild(squareDiv);
    });
  }

  drawBoard(gameBoard);

  function squareClick() {
    // Promise function used to return the index of the square clicked by the player.
    const squares = document.querySelectorAll(".square");
    return new Promise((resolve, reject) => {
      squares.forEach((square, index) => {
        square.addEventListener("click", () => {
          position = index;
          resolve();
        });
      });
    });
  }

  async function getPosition() {
    // Async function used to wait until an users clicks.
    await squareClick();
    return position;
  }

  function updateBoard(array) {
    // Function used to update the gameboard as the users are clicking.
    const squares = document.querySelectorAll(".square");
    for (let i = 0; i < squares.length; i++) {
      if (array[i] !== squares[i]) {
        squares[i].innerText = array[i];
      }
    }
  }

  function startNewGame() {
    gameBoard.clearBoard();
    let Player1 = prompt(`Write the name of the Player 1: `);
    let Player2 = prompt(`Write the name of the Player 2: `);
    gameController(Player1, Player2);
  }

  const newGameButton = document.getElementById("new-game");
  newGameButton.addEventListener("click", startNewGame);

  return { drawBoard, updateBoard, getPosition };
})();
