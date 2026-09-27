/* =========================================
   CHESS X SUNIX
   BOARD CONTROLLER
========================================= */


let selectedSquare = null;


/* =========================================
   CREATE BOARD
========================================= */

function createBoard(elementId = "chess-board") {

    const board =
        document.getElementById(elementId);

    if (!board) {
        return;
    }


    board.innerHTML = "";


    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const square =
                document.createElement("div");

            square.classList.add("square");


            if ((row + col) % 2 === 0) {

                square.classList.add(
                    "light-square"
                );

            } else {

                square.classList.add(
                    "dark-square"
                );

            }


            square.dataset.row = row;
            square.dataset.col = col;


            const piece =
                boardState[row][col];


            square.textContent =
                pieceSymbol(piece);


            square.onclick = () => {

                handleSquareClick(
                    row,
                    col
                );

            };


            board.appendChild(square);

        }

    }

}


/* =========================================
   CLICK SQUARE
========================================= */

function handleSquareClick(row, col) {

    if (
        typeof gameOver !== "undefined" &&
        gameOver
    ) {
        return;
    }


    const piece =
        boardState[row][col];


    /* SELECT PIECE */

    if (!selectedSquare) {

        if (!piece) {
            return;
        }


        if (
            pieceColor(piece) !== currentTurn
        ) {
            return;
        }


        selectedSquare = {
            row,
            col
        };


        renderBoard();

        return;

    }


    /* CLICK OWN PIECE */

    if (
        piece &&
        pieceColor(piece) === currentTurn
    ) {

        selectedSquare = {
            row,
            col
        };


        renderBoard();

        return;

    }


    /* ATTEMPT MOVE */

    const move = {

        fromRow:
            selectedSquare.row,

        fromCol:
            selectedSquare.col,

        toRow:
            row,

        toCol:
            col

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


        if (
            typeof checkGameStatus ===
            "function"
        ) {

            checkGameStatus();

        }


        /* BOT TURN */

        if (
            !gameOver &&
            currentTurn === BLACK &&
            typeof botMove === "function"
        ) {

            setTimeout(
                botMove,
                300
            );

        }

        return;

    }


    selectedSquare = null;

    renderBoard();

}


/* =========================================
   RENDER BOARD
========================================= */

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

        squares[index].classList.add(
            "selected-square"
        );

    }


    /* HIGHLIGHT LEGAL MOVES */

    const moves =
        generateLegalMoves(
            currentTurn
        );


    for (const move of moves) {

        if (
            move.fromRow ===
            selectedSquare.row &&

            move.fromCol ===
            selectedSquare.col
        ) {

            const targetIndex =
                move.toRow * 8 +
                move.toCol;


            if (squares[targetIndex]) {

                squares[targetIndex].style.boxShadow =
                    "inset 0 0 0 5px rgba(250, 204, 21, 0.7)";

            }

        }

    }

}


/* =========================================
   START BOARD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createBoard();

    }
);
