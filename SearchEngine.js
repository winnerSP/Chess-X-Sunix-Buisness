/* =========================================
   MY STORE — SEARCH ENGINE V2.0
========================================= */


/* =========================================
   PRODUCT DATA

   Later, the database will provide this.
========================================= */

const searchProductsData = [

    {
        name: "Product One",
        description: "Product description goes here.",
        category: "general",
        keys: [
            "product",
            "one"
        ],
        price: 999
    },

    {
        name: "Product Two",
        description: "Product description goes here.",
        category: "general",
        keys: [
            "product",
            "two"
        ],
        price: 799
    },

    {
        name: "Product Three",
        description: "Product description goes here.",
        category: "general",
        keys: [
            "product",
            "three"
        ],
        price: 499
    }

];


/* =========================================
   NORMALIZE SEARCH
========================================= */

function normalizeSearch(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 0);

}


/* =========================================
   CALCULATE PRODUCT SCORE
========================================= */

function calculateSearchScore(product, searchWords) {

    let score = 0;

    const name =
        product.name.toLowerCase();

    const description =
        product.description.toLowerCase();

    const category =
        product.category.toLowerCase();

    const keys =
        product.keys.map(
            key => key.toLowerCase()
        );


    searchWords.forEach(function(word) {


        /* Exact name match */

        if (name === word) {
            score += 100;
        }


        /* Name contains word */

        if (name.includes(word)) {
            score += 50;
        }


        /* Key match */

        keys.forEach(function(key) {

            if (key === word) {

                score += 40;

            } else if (key.includes(word)) {

                score += 20;

            }

        });


        /* Description match */

        if (description.includes(word)) {
            score += 15;
        }


        /* Category match */

        if (category.includes(word)) {
            score += 25;
        }

    });


    return score;

}


/* =========================================
   SEARCH
========================================= */

function searchEngine(query) {

    const searchWords =
        normalizeSearch(query);


    /* Empty search */

    if (searchWords.length === 0) {

        return searchProductsData;

    }


    const results = [];


    searchProductsData.forEach(function(product) {

        const score =
            calculateSearchScore(
                product,
                searchWords
            );


        if (score > 0) {

            results.push({

                product: product,

                score: score

            });

        }

    });


    /* Highest score first */

    results.sort(function(a, b) {

        return b.score - a.score;

    });


    return results;

}


/* =========================================
   DISPLAY SEARCH RESULTS
========================================= */

function runStoreSearch() {

    const input =
        document.getElementById("searchInput");


    if (!input) {
        return;
    }


    const query =
        input.value;


    const results =
        searchEngine(query);


    const productCards =
        document.querySelectorAll(".product-card");


    const noResults =
        document.getElementById("noResults");


    /* Hide everything first */

    productCards.forEach(function(card) {

        card.style.display = "none";

    });


    let found = false;


    /* Show matching products */

    results.forEach(function(result) {

        const product =
            result.product;


        productCards.forEach(function(card) {

            const cardName =
                card.getAttribute("data-name");


            if (
                cardName &&
                cardName.toLowerCase() ===
                product.name.toLowerCase()
            ) {

                card.style.display = "block";

                found = true;

            }

        });

    });


    /* No results */

    if (noResults) {

        noResults.style.display =
            found ? "none" : "block";

    }

}


/* =========================================
   CONNECT SEARCH BAR
========================================= */

const searchInput =
    document.getElementById("searchInput");


if (searchInput) {


    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                runStoreSearch();

            }

        }
    );

}
