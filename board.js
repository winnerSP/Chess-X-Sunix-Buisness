/* =========================================
   CHESS X SUNIX
   BOARD CONTROLLER
========================================= */

let selectedSquare = null;

function createBoard(elementId = "chess-board") {

    const board = document.getElementById(elementId);

    if (!board) return;

    board.innerHTML = "";

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const square = document.createElement("div");

            square.classList.add("square");

            if ((row + col) % 2 === 0) {
                square.classList.add("light-square");
            } else {
                square.classList.add("dark-square");
            }

            square.dataset.row = row;
            square.dataset.col = col;

            const piece = boardState[row][col];

            if (piece) {

                const pieceElement =
                    document.createElement("span");

                pieceElement.classList.add("chess-piece");

                if (pieceColor(piece) === WHITE) {
                    pieceElement.classList.add("white-piece");
                } else {
                    pieceElement.classList.add("black-piece");
                }

                pieceElement.textContent =
                    pieceSymbol(piece);

                square.appendChild(pieceElement);
            }

            square.onclick = () => {
                handleSquareClick(row, col);
            };

            board.appendChild(square);
        }
    }
}


function handleSquareClick(row, col) {

    if (typeof gameOver !== "undefined" && gameOver) {
        return;
    }

    const piece = boardState[row][col];

    if (!selectedSquare) {

        if (!piece) return;

        if (pieceColor(piece) !== currentTurn) {
            return;
        }

        selectedSquare = {
            row: row,
            col: col
        };

        renderBoard();

        return;
    }


    if (piece && pieceColor(piece) === currentTurn) {

        selectedSquare = {
            row: row,
            col: col
        };

        renderBoard();

        return;
    }


    const move = {
        fromRow: selectedSquare.row,
        fromCol: selectedSquare.col,
        toRow: row,
        toCol: col
    };


    if (
        isLegalMove(
            move.fromRow,
            move.fromCol,
            move.toRow,
            move.toCol
        )
    ) {

        makeMove(
            move.fromRow,
            move.fromCol,
            move.toRow,
            move.toCol
        );

        selectedSquare = null;

        renderBoard();

        if (typeof checkGameStatus === "function") {
            checkGameStatus();
        }

        if (
            !gameOver &&
            currentTurn === BLACK &&
            typeof botMove === "function"
        ) {

            setTimeout(botMove, 300);
        }

        return;
    }


    selectedSquare = null;

    renderBoard();
}


function renderBoard() {

    createBoard();

    if (!selectedSquare) {
        return;
    }


    const squares =
        document.querySelectorAll(
            "#chess-board .square"
        );


    const index =
        selectedSquare.row * 8 +
        selectedSquare.col;


    if (squares[index]) {

        squares[index]
            .classList
            .add("selected-square");
    }


    const moves =
        generateLegalMoves(currentTurn);


    for (const move of moves) {

        if (
            move.fromRow === selectedSquare.row &&
            move.fromCol === selectedSquare.col
        ) {

            const targetIndex =
                move.toRow * 8 +
                move.toCol;


            if (squares[targetIndex]) {

                squares[targetIndex]
                    .classList
                    .add("legal-target");
            }
        }
    }
}


document.addEventListener(
    "DOMContentLoaded",
    () => {
        createBoard();
    }
);
