// State management
let currentOffset = 0;
let currentLimit = 8;
let cart = [];
let maxPrice = 200;

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search');
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');
const loadMoreBtn = document.getElementById('load-more');
const cartButton = document.getElementById('cart-button');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');

// Bootstrap Modals
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
const productModal = new bootstrap.Modal(document.getElementById('productModal'));

// Event Listeners
searchInput.addEventListener('input', debounce(loadProducts, 300));
priceRange.addEventListener('input', updatePriceValue);
priceRange.addEventListener('change', loadProducts);
loadMoreBtn.addEventListener('click', loadMore);
cartButton.addEventListener('click', () => cartModal.show());
document.getElementById('checkout-button').addEventListener('click', checkout);

// Initialize
loadProducts();

// Functions
async function loadProducts(reset = true) {
    if (reset) {
        currentOffset = 0;
        productsGrid.innerHTML = '';
    }

    const searchTerm = searchInput.value;
    const maxPrice = priceRange.value;

    try {
        const response = await fetch(`/api/parts?offset=${currentOffset}&limit=${currentLimit}&search=${searchTerm}&maxPrice=${maxPrice}`);
        const data = await response.json();

        if (data.parts.length === 0 && currentOffset === 0) {
            productsGrid.innerHTML = '<div class="col-12 text-center"><h3>No products found</h3></div>';
            loadMoreBtn.style.display = 'none';
            return;
        }

        data.parts.forEach(part => {
            const productCard = createProductCard(part);
            productsGrid.appendChild(productCard);
        });

        loadMoreBtn.style.display = data.parts.length < currentLimit ? 'none' : 'block';
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<div class="col-12 text-center"><h3>Error loading products</h3></div>';
    }
}

function createProductCard(part) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3';
    col.innerHTML = `
        <div class="card product-card" data-id="${part.id}">
            <div class="position-relative">
                <img src="${part.image}" class="card-img-top" alt="${part.name}">
                <span class="price-badge">$${part.price.toFixed(2)}</span>
            </div>
            <div class="card-body">
                <h5 class="card-title">${part.name}</h5>
                <p class="card-text">${part.description.substring(0, 50)}...</p>
                <button class="btn btn-primary add-to-cart" data-id="${part.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    // Event Listeners
    const card = col.querySelector('.card');
    const addToCartBtn = col.querySelector('.add-to-cart');

    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('add-to-cart')) {
            showProductDetails(part);
        }
    });

    addToCartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(part);
    });

    return col;
}

function showProductDetails(part) {
    const detailContent = document.getElementById('product-detail-content');
    detailContent.innerHTML = `
        <img src="${part.image}" class="product-detail-img" alt="${part.name}">
        <h4>${part.name}</h4>
        <p class="text-muted">Manufacturer: ${part.manufacturer}</p>
        <p>${part.description}</p>
        <h5>Price: $${part.price.toFixed(2)}</h5>
        <button class="btn btn-primary mt-3" onclick="addToCart(${JSON.stringify(part).replace(/"/g, '&quot;')})">
            Add to Cart
        </button>
    `;
    productModal.show();
}

function addToCart(part) {
    const existingItem = cart.find(item => item.id === part.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...part, quantity: 1 });
    }
    
    updateCartUI();
    showToast('Product added to cart');
}

function removeFromCart(partId) {
    cart = cart.filter(item => item.id !== partId);
    updateCartUI();
}

function updateQuantity(partId, delta) {
    const item = cart.find(item => item.id === partId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        updateCartUI();
    }
}

function updateCartUI() {
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h6>${item.name}</h6>
                <p class="text-muted">$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function loadMore() {
    currentOffset += currentLimit;
    loadProducts(false);
}

function updatePriceValue() {
    priceValue.textContent = priceRange.value;
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert('Thank you for your purchase! This is a demo app, so no actual purchase will be processed.');
    cart = [];
    updateCartUI();
    cartModal.hide();
}

function showToast(message) {
    // You can implement a toast notification here
    console.log(message);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
