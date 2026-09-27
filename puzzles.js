document.addEventListener(
    "DOMContentLoaded",
    () => {

        const board =
            document.getElementById(
                "puzzle-board"
            );

        if (!board) {
            return;
        }

        boardState =
            createStartingBoard();

        createBoard("puzzle-board");

        loadPuzzle();

    }
);
