let boardState = createStartingBoard();

let selectedSquare = null;

let currentTurn = "white";


function createBoard(elementId = "chess-board") {

    const board = document.getElementById(elementId);

    if (!board) {
        return;
    }

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

            square.textContent = pieceSymbol(piece);

            square.onclick = () => {
                selectSquare(row, col);
            };

            board.appendChild(square);

        }

    }

}


function selectSquare(row, col) {

    const piece = boardState[row][col];

    if (!selectedSquare) {

        if (!piece) {
            return;
        }

        if (pieceColor(piece) !== currentTurn) {
            return;
        }

        selectedSquare = {
            row,
            col
        };

        renderBoard();

        return;
    }


    if (
        selectedSquare.row === row &&
        selectedSquare.col === col
    ) {

        selectedSquare = null;

        renderBoard();

        return;
    }


    movePiece(
        selectedSquare.row,
        selectedSquare.col,
        row,
        col
    );

}


function movePiece(fromRow, fromCol, toRow, toCol) {

    const piece =
        boardState[fromRow][fromCol];

    if (!piece) {
        return;
    }

    if (!isLegalMove(
        fromRow,
        fromCol,
        toRow,
        toCol
    )) {
        return;
    }

    boardState[toRow][toCol] = piece;

    boardState[fromRow][fromCol] = null;

    selectedSquare = null;

    currentTurn =
        currentTurn === "white"
            ? "black"
            : "white";

    renderBoard();

    if (typeof botMove === "function") {

        if (currentTurn === "black") {
            setTimeout(botMove, 400);
        }

    }

}


function renderBoard() {

    createBoard();

    if (!selectedSquare) {
        return;
    }

    const squares =
        document.querySelectorAll("#chess-board .square");

    const index =
        selectedSquare.row * 8 +
        selectedSquare.col;

    if (squares[index]) {
        squares[index].classList.add(
            "selected-square"
        );
    }

}


function resetBoard() {

    boardState = createStartingBoard();

    selectedSquare = null;

    currentTurn = "white";

    renderBoard();

}
