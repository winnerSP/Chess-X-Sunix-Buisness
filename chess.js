const pieces = {

    white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙"
    },

    black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟"
    }

};


function createStartingBoard() {

    return [

        ["black-rook", "black-knight", "black-bishop", "black-queen",
         "black-king", "black-bishop", "black-knight", "black-rook"],

        ["black-pawn", "black-pawn", "black-pawn", "black-pawn",
         "black-pawn", "black-pawn", "black-pawn", "black-pawn"],

        [null, null, null, null, null, null, null, null],

        [null, null, null, null, null, null, null, null],

        [null, null, null, null, null, null, null, null],

        [null, null, null, null, null, null, null, null],

        ["white-pawn", "white-pawn", "white-pawn", "white-pawn",
         "white-pawn", "white-pawn", "white-pawn", "white-pawn"],

        ["white-rook", "white-knight", "white-bishop", "white-queen",
         "white-king", "white-bishop", "white-knight", "white-rook"]

    ];

}


function pieceSymbol(piece) {

    if (!piece) {
        return "";
    }

    const parts = piece.split("-");

    return pieces[parts[0]][parts[1]];

}


function pieceColor(piece) {

    if (!piece) {
        return null;
    }

    return piece.startsWith("white")
        ? "white"
        : "black";

}
