/* =========================================
   MY STORE — DATABASE ADMIN V3.0
========================================= */


/*
    DATABASE STRUCTURE

    This file currently defines the structure
    of our database.

    Later, these objects will be replaced by
    a real backend database.
*/


/* =========================================
   USERS
========================================= */

const users = [];


/* =========================================
   BUSINESSES
========================================= */

const businesses = [];


/* =========================================
   PRODUCTS
========================================= */

const products = [];


/* =========================================
   ORDERS
========================================= */

const orders = [];


/* =========================================
   ORDER ITEMS
========================================= */

const orderItems = [];


/* =========================================
   AI SEARCH DATA
========================================= */

const aiSearchData = [];


/* =========================================
   CREATE USER
========================================= */

function createUser(
    username,
    email,
    passwordHash,
    isBusiness = false
) {

    const user = {

        user_id:
            users.length + 1,

        username:
            username,

        email:
            email,

        password_hash:
            passwordHash,

        isBusiness:
            isBusiness,

        created_at:
            new Date().toISOString()

    };


    users.push(user);


    return user;

}


/* =========================================
   CREATE BUSINESS
========================================= */

function createBusiness(
    ownerUserId,
    businessName,
    description
) {

    const business = {

        business_id:
            businesses.length + 1,

        owner_user_id:
            ownerUserId,

        business_name:
            businessName,

        description:
            description,

        created_at:
            new Date().toISOString()

    };


    businesses.push(business);


    return business;

}


/* =========================================
   CREATE PRODUCT
========================================= */

function createProduct(
    businessId,
    name,
    description,
    price,
    category,
    keys,
    stock
) {

    const product = {

        product_id:
            products.length + 1,

        business_id:
            businessId,

        name:
            name,

        description:
            description,

        price:
            price,

        category:
            category,

        keys:
            keys,

        stock:
            stock,

        created_at:
            new Date().toISOString()

    };


    products.push(product);


    return product;

}


/* =========================================
   FIND USER
========================================= */

function findUser(username) {

    return users.find(
        user =>
            user.username === username
    );

}


/* =========================================
   FIND BUSINESS
========================================= */

function findBusiness(ownerUserId) {

    return businesses.find(
        business =>
            business.owner_user_id === ownerUserId
    );

}


/* =========================================
   FIND PRODUCT
========================================= */

function findProduct(productId) {

    return products.find(
        product =>
            product.product_id === productId
    );

}
