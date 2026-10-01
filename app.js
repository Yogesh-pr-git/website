const app = document.getElementById("app");

const API_URL = "https://fakestoreapi.com/products";

let products = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ============================
// UPDATE CART COUNT
// ============================

function updateCartCount() {

    document.getElementById("cartCount").textContent =
        cart.length;
}


// ============================
// API - GET PRODUCTS
// ============================

async function getProducts() {

    try {

        app.innerHTML = `
            <div class="loading">
                Loading products...
            </div>
        `;

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        products = await response.json();

        showProducts();

    } catch (error) {

        app.innerHTML = `
            <div class="error">
                <h2>Something went wrong!</h2>
                <p>Please try again later.</p>
            </div>
        `;
    }
}


// ============================
// HOME PAGE
// ============================

function showHome() {

    app.innerHTML = `

        <section class="hero">

            <h1>Welcome to ShopZone</h1>

            <p>
                Discover amazing products at affordable prices.
                Browse our collection and find your favorite products.
            </p>

            <a href="#products" class="btn">
                Explore Products
            </a>

        </section>

    `;
}


// ============================
// PRODUCTS PAGE
// ============================

function showProducts() {

    if (products.length === 0) {
        getProducts();
        return;
    }

    app.innerHTML = `

        <section class="products-section">

            <h1>Our Products</h1>

            <div class="controls">

                <input
                    type="text"
                    id="search"
                    placeholder="Search products..."
                    oninput="filterProducts()"
                >

                <select
                    id="category"
                    onchange="filterProducts()"
                >

                    <option value="all">
                        All Categories
                    </option>

                    <option value="men's clothing">
                        Men's Clothing
                    </option>

                    <option value="women's clothing">
                        Women's Clothing
                    </option>

                    <option value="jewelery">
                        Jewelry
                    </option>

                    <option value="electronics">
                        Electronics
                    </option>

                </select>

            </div>

            <div
                id="productGrid"
                class="product-grid"
            ></div>

        </section>

    `;

    renderProducts(products);
}


// ============================
// RENDER PRODUCTS
// ============================

function renderProducts(list) {

    const grid =
        document.getElementById("productGrid");

    if (!grid) return;

    if (list.length === 0) {

        grid.innerHTML = `
            <p>No products found.</p>
        `;

        return;
    }

    grid.innerHTML = list.map(product => `

        <div class="product-card">

            <img
                src="${product.image}"
                alt="${product.title}"
                loading="lazy"
            >

            <h3>
                ${product.title}
            </h3>

            <p class="price">
                $${product.price}
            </p>

            <div class="card-buttons">

                <button
                    class="details-btn"
                    onclick="showDetails(${product.id})"
                >
                    Details
                </button>

                <button
                    class="cart-btn"
                    onclick="addToCart(${product.id})"
                >
                    Add Cart
                </button>

            </div>

        </div>

    `).join("");
}


// ============================
// SEARCH + FILTER
// ============================

function filterProducts() {

    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase();

    const category =
        document.getElementById("category").value;

    const filtered =
        products.filter(product => {

            const searchMatch =
                product.title
                    .toLowerCase()
                    .includes(search);

            const categoryMatch =
                category === "all" ||
                product.category === category;

            return searchMatch && categoryMatch;

        });

    renderProducts(filtered);
}


// ============================
// PRODUCT DETAILS
// ============================

function showDetails(id) {

    const product =
        products.find(p => p.id === id);

    if (!product) return;

    app.innerHTML = `

        <section class="details">

            <div>

                <img
                    src="${product.image}"
                    alt="${product.title}"
                >

            </div>

            <div>

                <h1>
                    ${product.title}
                </h1>

                <p class="price">
                    $${product.price}
                </p>

                <p>
                    ${product.description}
                </p>

                <p>
                    <strong>
                        Category:
                    </strong>

                    ${product.category}
                </p>

                <button
                    class="btn"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart
                </button>

            </div>

        </section>

    `;
}


// ============================
// ADD TO CART
// ============================

function addToCart(id) {

    const product =
        products.find(p => p.id === id);

    if (!product) return;

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert("Product added to cart!");
}


// ============================
// CART PAGE
// ============================

function showCart() {

    if (cart.length === 0) {

        app.innerHTML = `

            <section class="cart">

                <h1>Your Cart</h1>

                <p>
                    Your cart is empty.
                </p>

                <br>

                <a href="#products" class="btn">
                    Browse Products
                </a>

            </section>

        `;

        return;
    }


    app.innerHTML = `

        <section class="cart">

            <h1>Your Shopping Cart</h1>

            <div id="cartItems"></div>

            <div
                id="cartTotal"
                class="total"
            ></div>

        </section>

    `;

    renderCart();
}


// ============================
// RENDER CART
// ============================

function renderCart() {

    const container =
        document.getElementById("cartItems");

    const totalElement =
        document.getElementById("cartTotal");


    container.innerHTML =
        cart.map((product, index) => `

            <div class="cart-item">

                <img
                    src="${product.image}"
                    alt="${product.title}"
                >

                <div class="cart-info">

                    <h3>
                        ${product.title}
                    </h3>

                    <p>
                        $${product.price}
                    </p>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            </div>

        `).join("");


    const total =
        cart.reduce(
            (sum, product) =>
                sum + product.price,
            0
        );


    totalElement.innerHTML =
        `Total: $${total.toFixed(2)}`;
}


// ============================
// REMOVE CART ITEM
// ============================

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    showCart();
}


// ============================
// ABOUT PAGE
// ============================

function showAbout() {

    app.innerHTML = `

        <section class="page">

            <h1>About ShopZone</h1>

            <p>
                ShopZone is a modern e-commerce product
                catalog created as a Web Development
                Capstone Project.
            </p>

            <br>

            <p>
                This application uses HTML, CSS,
                JavaScript and REST API integration.
            </p>

        </section>

    `;
}


// ============================
// CONTACT PAGE
// ============================

function showContact() {

    app.innerHTML = `

        <section class="page">

            <h1>Contact Us</h1>

            <p>
                Email:
                support@shopzone.com
            </p>

            <p>
                Phone:
                +91 9876543210
            </p>

            <br>

            <form onsubmit="submitContact(event)">

                <input
                    type="text"
                    placeholder="Your Name"
                    required
                >

                <br><br>

                <input
                    type="email"
                    placeholder="Your Email"
                    required
                >

                <br><br>

                <textarea
                    placeholder="Your Message"
                    rows="5"
                    required
                ></textarea>

                <br><br>

                <button class="btn">
                    Send Message
                </button>

            </form>

        </section>

    `;
}


// ============================
// CONTACT FORM
// ============================

function submitContact(event) {

    event.preventDefault();

    alert(
        "Thank you! Your message has been received."
    );

}


// ============================
// CLIENT-SIDE ROUTER
// ============================

function router() {

    const route =
        location.hash.substring(1) || "home";


    switch (route) {

        case "home":
            showHome();
            break;

        case "products":
            showProducts();
            break;

        case "cart":
            showCart();
            break;

        case "about":
            showAbout();
            break;

        case "contact":
            showContact();
            break;

        default:
            showHome();

    }

    updateCartCount();
}


// ============================
// ROUTER EVENT
// ============================

window.addEventListener(
    "hashchange",
    router
);


// ============================
// START APPLICATION
// ============================

router();