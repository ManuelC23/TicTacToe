/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable default-param-last */
const Player = (name, position = undefined, mark) => ({
  name,
  position,
  mark,
});

const gameBoard = (() => {
  // Module used to create the gameboard.
  const board = ["", "", "", "", "", "", "", "", ""];

  const clearBoard = () => {
    for (let i = 0; i < 9; i++) {
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
    } else {
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
    // Function used to play a round of the game. Async is used because we need to wait for the players to click.
    let i = 0;
    let turn = 1;
    let position = "";
    while (i < 9) {
      if (turn === 1) {
        display.updateText(1);
        position = await display.getPosition();
        await checkPosition(position, newGame.getBoard(), Player1);
        if (checkWinner(newGame.getBoard(), winningCombinations)) {
          display.showPopup(i, Player1);
          newGame.clearBoard();
          return;
        }
        i++;
        turn = 2;
      } else {
        display.updateText(2);
        position = await display.getPosition();
        checkPosition(position, newGame.getBoard(), Player2);
        if (checkWinner(newGame.getBoard(), winningCombinations)) {
          display.showPopup(i, Player2);
          newGame.clearBoard();
          return;
        }
        i++;
        turn = 1;
      }
      if (i === 9) {
        display.showPopup(i);
        return;
      }
    }
  }

  return { playRound };
}

/////////////////////////////////////////////////////////////////////////////////////////

const displayController = (() => {
  const gameBoardDiv = document.getElementById("gameboard");

  function drawBoard(gameboard) {
    // Function used to draw the initial empty gameBoard;
    gameboard.getBoard().forEach((element, index) => {
      const squareDiv = document.createElement("div");
      squareDiv.className = "square";
      squareDiv.innerText = element;
      squareDiv.setAttribute("data-index", index);
      gameBoardDiv.appendChild(squareDiv);
    });
  }

  drawBoard(gameBoard);

  function updateText(turn) {
    //Function used to update the Text's information.
    const text = document.getElementById("turn-text");
    if (turn === 1) {
      text.innerText = "It's X's turn.";
    } else {
      text.innerText = "It's O's turn.";
    }
  }

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
    const game = gameController("X", "O");
    game.playRound();
  }

  const newGameButton = document.getElementById("new-game");
  newGameButton.addEventListener("click", () => {
    newGameButton.style.display = "none";
    startNewGame();
  });

  const restartGameButton = document.querySelector(".restart-game");
  restartGameButton.addEventListener("click", startNewGame);

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

  function showPopup(i, Player = undefined) {
    // Function used to show a Popup afther the games finishes
    const popupBackgroundSelector = document.querySelector(".popup-background");
    popupBackgroundSelector.style.display = "block";
    const popupDivSelector = document.querySelector(".final-popup");
    popupDivSelector.style.display = "flex";
    const popupTextSelector = document.querySelector(".popup-text");
    const restartButtonSelector = document.querySelector(".restart-game");
    restartButtonSelector.addEventListener("click", () => {
      popupDivSelector.style.display = "none";
      popupBackgroundSelector.style.display = "none";
    });
    if (i === 9) {
      popupTextSelector.innerText = "Nobody wins!"; // Text displaying the game is even.
      closePopup();
      return;
    }
    popupTextSelector.innerText = `${Player.name} wins!`; // Text displaying the game winner in case there's any.
    closePopup();
  }

  function closePopup() {
    // Function used to close the after-game popup.
    const popupDivSelector = document.querySelector(".final-popup");
    const closeButtonSelector = document.querySelector(".close-game");
    const text = document.getElementById("turn-text");
    const popupBackgroundSelector = document.querySelector(".popup-background");
    closeButtonSelector.addEventListener("click", () => {
      popupBackgroundSelector.style.display = "none";
      popupDivSelector.style.display = "none";
      newGameButton.style.display = "block";
      text.innerText = "Click 'New Game' to Play Again";
    });
  }

  return {
    drawBoard,
    updateBoard,
    getPosition,
    markStyle,
    showPopup,
    updateText,
  };
})();
