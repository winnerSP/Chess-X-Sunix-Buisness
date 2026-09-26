/* =========================================
   MY STORE — AI SEARCH LEARNING SYSTEM V2.0
========================================= */


/*
    This is the first version of our learning AI.

    It learns relationships like:

    "blue shoes" → Product One

    The more often a product is selected after
    a search, the stronger its learned score becomes.

    For now, learning is stored in localStorage.
    Later, the database will store this information.
*/


/* =========================================
   LOAD LEARNING DATA
========================================= */

let aiLearningData =
    JSON.parse(
        localStorage.getItem("aiLearningData")
    ) || {};


/* =========================================
   SAVE LEARNING DATA
========================================= */

function saveAILearning() {

    localStorage.setItem(
        "aiLearningData",
        JSON.stringify(aiLearningData)
    );

}


/* =========================================
   NORMALIZE KEY
========================================= */

function aiNormalize(text) {

    return text
        .toLowerCase()
        .trim();

}


/* =========================================
   LEARN FROM USER INTERACTION
========================================= */

function aiLearn(search, productName) {

    search = aiNormalize(search);
    productName = aiNormalize(productName);

    if (!search || !productName) {
        return;
    }


    if (!aiLearningData[search]) {

        aiLearningData[search] = {};

    }


    if (!aiLearningData[search][productName]) {

        aiLearningData[search][productName] = 0;

    }


    /*
        Increase the relationship strength.

        Example:

        "blue shoes"
              ↓
        "Product One"

        1 interaction = 1
        2 interactions = 2
        etc.
    */

    aiLearningData[search][productName]++;


    saveAILearning();

}


/* =========================================
   GET LEARNED SCORE
========================================= */

function aiGetLearnedScore(search, productName) {

    search = aiNormalize(search);
    productName = aiNormalize(productName);


    if (
        !aiLearningData[search] ||
        !aiLearningData[search][productName]
    ) {

        return 0;

    }


    return aiLearningData[search][productName];

}


/* =========================================
   AI RANKING
========================================= */

function aiRankResults(results, search) {

    results.forEach(function(result) {

        const learnedScore =
            aiGetLearnedScore(
                search,
                result.product.name
            );


        /*
            Learned score is multiplied so
            useful learned relationships can
            influence normal search ranking.
        */

        result.score +=
            learnedScore * 10;

    });


    results.sort(function(a, b) {

        return b.score - a.score;

    });


    return results;

}


/* =========================================
   REMEMBER SEARCH
========================================= */

let lastAISearch = "";


function aiRememberSearch(search) {

    lastAISearch =
        search.trim();

}


/* =========================================
   LEARN WHEN PRODUCT IS SELECTED
========================================= */

function aiProductSelected(productName) {

    if (!lastAISearch) {
        return;
    }


    aiLearn(
        lastAISearch,
        productName
    );

}
