const productContainer = document.getElementById("product-container");
const cartMainContainer = document.getElementById("cart-main-container");
const countSpan = document.getElementById("count");
const totalSpan = document.getElementById("total");

let currentCartTotal = 0;

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
    productContainer.innerHTML = '';

    products.forEach((product) => {
        const colDiv = document.createElement("div");
        colDiv.classList.add("col");

        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card", "h-100", "shadow-sm");

        cardDiv.innerHTML = `
            <img class="card-img-top mx-auto d-block p-3" src="${product.image}" alt="${product.title}" style="max-width: 150px; height: 150px; object-fit: contain;" />
            <div class="card-body d-flex flex-column">
                <h5 class="card-title product-title">${product.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted product-price">Price: $${product.price.toFixed(2)}</h6>
                <p class="card-text flex-grow-1 product-description">${product.description.slice(0, 100)}...</p>
                <div class="mt-auto">
                    <button class="btn btn-outline-primary btn-sm me-2" onclick="singleProduct(${product.id})">Details</button>
                    <button class="btn btn-success btn-sm" onclick="handleAddToCart('${product.title.slice(0, 20).replace(/'/g, "\\'")}', ${product.price})">Add to Cart</button>
                </div>
            </div>
        `;

        colDiv.appendChild(cardDiv);
        productContainer.appendChild(colDiv);
    });
};

const handleAddToCart = (name, price) => {
    let cartCount = parseInt(countSpan.innerText);
    cartCount++;
    countSpan.innerText = cartCount;

    currentCartTotal += price;

    const div = document.createElement("div");
    div.classList.add("d-flex", "justify-content-between", "align-items-center", "my-2", "border-bottom", "pb-2", "cart-item");

    div.innerHTML = `
        <p class="mb-0 cart-item-name">${name}</p>
        <h6 class="price mb-0 cart-item-price">$${price.toFixed(2)}</h6>
    `;
    cartMainContainer.appendChild(div);

    UpdateTotalDisplay();
};

const UpdateTotalDisplay = () => {
    totalSpan.innerText = currentCartTotal.toFixed(2);
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