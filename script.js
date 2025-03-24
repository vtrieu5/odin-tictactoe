function Gameboard() {
    const rows = 3
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j=0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeMarker = (row, column, player) => {
        if (board[row][column].getValue() !== "") {
            return;
        }
        board[row][column].addMarker(player);
        return player;
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues)
    }

    const checkWin = () => {
        for (let i = 0; i < rows; i++) {
            // Check rows
            if (board[i][0].getValue() === board[i][1].getValue() && board[i][1].getValue() === board[i][2].getValue()) {
                if (board[i][0].getValue() !== "") {
                    return true;
                }
            }
            // Check columns
            if (board[0][i].getValue() === board[1][i].getValue() && board[1][i].getValue() === board[2][i].getValue()) {
                if (board[0][i].getValue() !== "") {
                    return true;
                }
            }
        }
        // Check diagonals
        if (board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue()) {
            if (board[1][1].getValue() !== "") {
                return true;
            }
        }
        if (board[0][2].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][0].getValue()) {
            if (board[1][1].getValue() != "") {
                return true;
            }
        }
        return false;
    }

    const checkDraw = () => {
        const draw = board.every(row => row.every(cell => cell.getValue() !== ""));
        return draw;
    }

    return {getBoard, placeMarker, printBoard, checkWin, checkDraw};
}

function Cell() {
    let value = "";
    
    const addMarker = (player) => {value = player;}

    const getValue = () => value;

    return {addMarker, getValue};
}

function GameController (p1Name, p2Name) {
    const board = Gameboard();

    const players = [
        {
            name: p1Name,
            marker: 'X'
        },
        {
            name: p2Name,
            marker: 'O'
        }
    ];
    
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn `)
    };

    const playRound = (row, column) => {
        let action = board.placeMarker(row, column, getActivePlayer().marker);
        if (action == null) {
            return;
        }
        if (board.checkWin()) {
            console.log(`${getActivePlayer().name} wins!`);
            return "win";
        } else if (board.checkDraw()) {
            console.log("The game is a draw.");
            return "draw";
        };
        switchPlayerTurn();
        printNewRound();
    };

    // printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

function ScreenController(p1Name, p2Name) {
    const game = GameController(p1Name, p2Name);
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    let gameState = "";
    const updateScreen = (gameState) => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
        let i = 0;
        board.forEach(row => {
            row.forEach((cell, index) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = i;
                cellButton.dataset.column = index;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
                
            })
            i += 1;
        })
        if (gameState === 'win') {
            playerTurnDiv.textContent = `${activePlayer.name} wins!`;
        } else if (gameState === 'draw') {
            playerTurnDiv.textContent = "The game is a draw.";
        }
        return gameState;
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        if (!selectedColumn) return;
        if (gameState === 'win' | gameState === 'draw') {
            return;
        }
        else {
            gameState = updateScreen(game.playRound(selectedRow, selectedColumn));
        }
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen("");

}

function startGame() {
    const dialog = document.querySelector('dialog');
    const restartButton = document.querySelector('#btn-restart');
    const nameForm = document.getElementById("myForm");
    
    dialog.showModal();
    
    nameForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const p1Name = document.getElementById("p1Name");
        const p2Name = document.getElementById("p2Name");
        ScreenController(p1Name.value, p2Name.value);
        dialog.close();
    })
    
    restartButton.addEventListener("click", () => {
        location.reload();
    })

}

startGame()
