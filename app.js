// app.js
let cart = []; // Global array to store cart items

const productContainer = document.getElementById("product-container");
const cartMainContainer = document.getElementById("cart-main-container");
const countSpan = document.getElementById("count");
const totalSpan = document.getElementById("total");

// Get templates
const productCardTemplate = document.getElementById("product-card-template");
const cartItemTemplate = document.getElementById("cart-item-template");

const loadAllProduct = () => {
    fetch("https://fakestoreapi.com/products")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            displayProduct(data);
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
            productContainer.innerHTML = `<div class="col-12"><p class="alert alert-danger">Failed to load products. Please try again later.</p></div>`;
        });
};

const displayProduct = (products) => {
    productContainer.innerHTML = ''; // Clear previous products if any

    products.forEach((product) => {
        // Clone the template content
        const cardClone = document.importNode(productCardTemplate.content, true);

        // Find elements within the cloned content and populate them
        const img = cardClone.querySelector(".card-img-top");
        img.src = product.image;
        img.alt = product.title;

        cardClone.querySelector(".product-title").textContent = product.title;
        cardClone.querySelector(".product-price").textContent = `Price: $${product.price.toFixed(2)}`;
        cardClone.querySelector(".product-description").textContent = `${product.description.slice(0, 100)}...`;

        // Attach data attributes for event delegation
        const detailsBtn = cardClone.querySelector(".details-btn");
        detailsBtn.dataset.productId = product.id; // Store product ID

        const addToCartBtn = cardClone.querySelector(".add-to-cart-btn");
        addToCartBtn.dataset.productId = product.id; // Store product ID
        addToCartBtn.dataset.productName = product.title.slice(0, 20); // Store name
        addToCartBtn.dataset.productPrice = product.price; // Store price

        productContainer.appendChild(cardClone);
    });
};

// Event delegation for product buttons
productContainer.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('details-btn')) {
        const productId = target.dataset.productId;
        singleProduct(productId);
    } else if (target.classList.contains('add-to-cart-btn')) {
        const productId = target.dataset.productId;
        const productName = target.dataset.productName;
        const productPrice = parseFloat(target.dataset.productPrice);
        handleAddToCart(productName, productPrice, productId);
    }
});


const handleAddToCart = (name, price, id) => {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    updateCartUI();
    UpdateTotal();
};

const updateCartUI = () => {
    cartMainContainer.innerHTML = ''; // Clear current cart display

    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;

        // Clone the cart item template
        const cartItemClone = document.importNode(cartItemTemplate.content, true);

        // Populate elements within the cloned item
        const itemNameElem = cartItemClone.querySelector(".cart-item-name");
        itemNameElem.textContent = `${item.name} `; // Add a space for the badge
        const quantityBadge = document.createElement('span');
        quantityBadge.classList.add('badge', 'bg-secondary');
        quantityBadge.textContent = item.quantity;
        itemNameElem.appendChild(quantityBadge); // Append badge to the name element

        cartItemClone.querySelector(".cart-item-price").textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        cartMainContainer.appendChild(cartItemClone);
    });

    countSpan.innerText = totalItems;
};


const UpdateTotal = () => {
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalSpan.innerText = total.toFixed(2);
};

const singleProduct = (id) => {
    console.log(`Fetching details for product ID: ${id}`);
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((productDetails) => {
            console.log("Single product details:", productDetails);
            alert(`Product: ${productDetails.title}\nCategory: ${productDetails.category}\nDescription: ${productDetails.description}\nRating: ${productDetails.rating.rate} (${productDetails.rating.count} reviews)`);
        })
        .catch((error) => {
            console.error("Error fetching single product:", error);
            alert("Failed to load product details.");
        });
};

loadAllProduct();