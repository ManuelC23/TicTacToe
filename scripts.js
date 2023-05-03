const Player = (name, position = undefined, mark) => {
  return {
    name,
    position,
    mark,
  };
};

let Player1;
let Player2;

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
    displayController.updateBoard(gameBoard.getBoard());
  };

  return { clearBoard, printBoard, addMark, getBoard };
})();

////////////////////////////////////////////////////////////////////////////////////////////

function gameController(Player1Name, Player2Name) {
  const newGame = gameBoard;
  const display = displayController;
  newGame.clearBoard();
  display.updateBoard(newGame.getBoard());

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
      display.markStyle();
    } else if (array[position] !== "") {
      // If the position is taken, another position is requested and the code execution stops until a valid position is entered.
      console.log(array[position]);
      let newPosition = position;
      while (array[newPosition] !== "") {
        console.log(array[newPosition] !== "");
        console.log(array);
        newPosition = await display.getPosition();
      }
      newGame.addMark(newPosition, player.mark);
      display.markStyle();
      return;
    }
  }

  async function playRound() {
    // Function used to play a round of the game. Async is used because we will need to wait for the players to click.
    while (i < 9) {
      position = await display.getPosition();
      await checkPosition(position, newGame.getBoard(), Player1);
      if (checkWinner(newGame.getBoard(), winningCombinations)) {
        display.showPopup(i, Player1);
        newGame.clearBoard();
        position = null;
        return;
      }
      i++;
      if (i === 9) {
        display.showPopup(i);
        position = null;
        return;
      }
      position = await display.getPosition();
      await checkPosition(position, newGame.getBoard(), Player2);
      if (checkWinner(newGame.getBoard(), winningCombinations)) {
        display.showPopup(i, Player2);
        newGame.clearBoard();
        position = null;
        return;
      }
      i++;
    }
    return;
  }

  return { playRound };
}

/////////////////////////////////////////////////////////////////////////////////////////

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
    return new Promise((resolve) => {
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
    // Function used to start a new game
    Player1 = prompt(`Write the name of the Player 1: `);
    Player2 = prompt(`Write the name of the Player 2: `);
    gameBoard.clearBoard();
    const game = gameController(Player1, Player2);
    game.playRound();
  }

  const newGameButton = document.getElementById("new-game");
  newGameButton.addEventListener("click", startNewGame);

  function markStyle() {
    // Function used to add custom classnames to the marks added by the user.
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      if (square.innerText === "X") {
        square.className = "square X";
      }
      if (square.innerText === "O") {
        square.className = "square O";
      }
    });
  }

  function closePopup() {
    // Function used to close the after-game popup.
    const popupDivSelector = document.querySelector(".final-popup");
    const closeButtonSelector = document.querySelector(".close-game");
    closeButtonSelector.addEventListener("click", () => {
      popupDivSelector.style.display = "none";
    });
  }

  function showPopup(i, Player = undefined) {
    // Function used to show a Popup afther the games finishes
    const popupDivSelector = document.querySelector(".final-popup");
    popupDivSelector.style.display = "flex";
    const popupTextSelector = document.querySelector(".popup-text");
    const restartButtonSelector = document.querySelector(".restart-game");
    restartButtonSelector.addEventListener("click", () => {
      popupDivSelector.style.display = "none";
      const game = gameController(Player1, Player2);
      game.playRound();
    });
    if (i === 9) {
      popupTextSelector.innerText = "Nobody wins! It's a Draw!"; // Text displaying the game is even.
      closePopup();
      return;
    }
    popupTextSelector.innerText = `${Player.name} wins!`; // Text displaying the game winner in case there's any.
    closePopup();
  }

  return { drawBoard, updateBoard, getPosition, markStyle, showPopup };
})();
