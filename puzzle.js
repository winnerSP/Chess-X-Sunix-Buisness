const puzzlePositions = [

    {
        title: "Mate in One",
        message: "Find the winning move."
    },

    {
        title: "Tactical Strike",
        message: "Look for a tactical opportunity."
    },

    {
        title: "King Attack",
        message: "Find the strongest attacking move."
    }

];


let currentPuzzle = 0;


function loadPuzzle() {

    currentPuzzle++;

    if (
        currentPuzzle >=
        puzzlePositions.length
    ) {

        currentPuzzle = 0;

    }


    const puzzle =
        puzzlePositions[currentPuzzle];


    const title =
        document.getElementById(
            "puzzle-title"
        );

    const status =
        document.getElementById(
            "puzzle-status"
        );


    if (title) {
        title.textContent =
            puzzle.title;
    }


    if (status) {
        status.textContent =
            puzzle.message;
    }

}
