/* WEBSITE 2.0 */


/* =========================
   RANDOM ADVERTISEMENT
========================= */

const ads = [
    "ADVERTISEMENT",
    "SPECIAL OFFER",
    "CHECK OUT THIS DEAL",
    "SPONSORED",
    "NEW PRODUCTS AVAILABLE"
];

const adRandom = Math.floor(Math.random() * ads.length);

const adBox = document.getElementById("randomAd");

if (adBox) {
    adBox.textContent = ads[adRandom];
}


/* =========================
   CART
========================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];


function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


/* =========================
   ADD TO CART
========================= */

function addToCart(name, price) {

    const existingProduct = cart.find(
        product => product.name === name
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    saveCart();

    alert(name + " added to cart!");
}


/* =========================
   BUY NOW
========================= */

function buyNow(name, price) {

    cart = [
        {
            name: name,
            price: price,
            quantity: 1
        }
    ];

    saveCart();

    window.location.href = "cart.html";
}


/* =========================
   SEARCH
========================= */

function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    const search =
        searchInput.value.toLowerCase().trim();

    const products =
        document.querySelectorAll(".product-card");

    let found = false;

    products.forEach(function(product) {

        const name =
            product
                .getAttribute("data-name")
                .toLowerCase();

        if (name.includes(search)) {

            product.style.display = "block";

            found = true;

        } else {

            product.style.display = "none";

        }

    });


    const noResults =
        document.getElementById("noResults");

    if (noResults) {

        noResults.style.display =
            found ? "none" : "block";

    }

}


/* =========================
   ENTER TO SEARCH
========================= */

const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                searchProducts();

            }

        }
    );

}
