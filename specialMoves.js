// CHESS X SUNIX — Special Move System
// Promotion + En Passant + Castling support


function getPromotionPiece(color) {

    const answer = prompt(
        "Promote your pawn to:\n\n" +
        "Q = Queen\n" +
        "R = Rook\n" +
        "B = Bishop\n" +
        "N = Knight",
        "Q"
    );

    const choice =
        (answer || "Q").toUpperCase();


    const pieces = {
        Q: "queen",
        R: "rook",
        B: "bishop",
        N: "knight"
    };

    const selected =
        pieces[choice] || "queen";

    return color + "-" + selected;
}


function isPromotionMove(move) {

    const piece =
        boardState[move.fromRow][move.fromCol];

    if (!piece) {
        return false;
    }

    if (pieceType(piece) !== "pawn") {
        return false;
    }

    return (
        move.toRow === 0 ||
        move.toRow === 7
    );
}


function getPromotionForMove(move) {

    const piece =
        boardState[move.fromRow][move.fromCol];

    const color =
        pieceColor(piece);

    return getPromotionPiece(color);
}


function canCastleKingside(color) {

    const row =
        color === WHITE ? 7 : 0;

    const king =
        boardState[row][4];

    const rook =
        boardState[row][7];

    if (king !== color + "-king") {
        return false;
    }

    if (rook !== color + "-rook") {
        return false;
    }


    if (
        color === WHITE &&
        gameState.whiteKingMoved
    ) {
        return false;
    }

    if (
        color === BLACK &&
        gameState.blackKingMoved
    ) {
        return false;
    }


    if (
        color === WHITE &&
        gameState.whiteRookRightMoved
    ) {
        return false;
    }

    if (
        color === BLACK &&
        gameState.blackRookRightMoved
    ) {
        return false;
    }


    if (
        boardState[row][5] !== null ||
        boardState[row][6] !== null
    ) {
        return false;
    }

    return true;
}


function canCastleQueenside(color) {

    const row =
        color === WHITE ? 7 : 0;

    const king =
        boardState[row][4];

    const rook =
        boardState[row][0];

    if (king !== color + "-king") {
        return false;
    }

    if (rook !== color + "-rook") {
        return false;
    }


    if (
        color === WHITE &&
        gameState.whiteKingMoved
    ) {
        return false;
    }

    if (
        color === BLACK &&
        gameState.blackKingMoved
    ) {
        return false;
    }


    if (
        color === WHITE &&
        gameState.whiteRookLeftMoved
    ) {
        return false;
    }

    if (
        color === BLACK &&
        gameState.blackRookLeftMoved
    ) {
        return false;
    }


    if (
        boardState[row][1] !== null ||
        boardState[row][2] !== null ||
        boardState[row][3] !== null
    ) {
        return false;
    }

    return true;
}
