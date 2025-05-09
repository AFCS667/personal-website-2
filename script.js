// Shopping Cart Functionality
let cart = [];
let cartCount = 0;

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.querySelector('.cart-total');
const cartCountElement = document.querySelector('.cart-count');

// Modal Elements
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.close-modal');

// Initialize the app
function init() {
    // Event Listeners
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Update cart count on page load
    updateCartCount();
}

// Toggle Cart Sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    renderCartItems();
}

// Open Product Modal
function openModal(productId) {
    // In a real app, you would fetch product details based on productId
    const product = {
        id: productId,
        name: 'The Golden Onesie - Customizable',
        price: 120,
        description: 'Premium quality golden onesie made with the finest materials. Customize with embroidery or monogramming for a personal touch.',
        images: [
            'https://images.unsplash.com/photo-1595341595379-cf0f2a0c4bfe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1594821207791-9ad82b56b3b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ],
        colors: ['#D4AF37', '#0F2C4E', '#FFFFFF', '#333333'],
        sizes: ['0-3M', '3-6M', '6-12M', '12-18M']
    };
    
    // Populate modal with product data
    document.querySelector('.product-title-lg').textContent = product.name;
    document.querySelector('.current-price-lg').textContent = `$${product.price.toFixed(2)}`;
    document.querySelector('.product-description').textContent = product.description;
    
    // Set main image
    const mainImage = document.querySelector('.main-image img');
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    // Set thumbnails
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    thumbnailContainer.innerHTML = '';
    
    product.images.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        thumbnail.innerHTML = `<img src="${img}" alt="${product.name} thumbnail">`;
        thumbnail.addEventListener('click', () => {
            mainImage.src = img;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // Set color options
    const colorOptions = document.querySelector('.color-options');
    colorOptions.innerHTML = '';
    
    product.colors.forEach((color, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        if (index === 0) colorOption.classList.add('selected');
        colorOption.style.backgroundColor = color;
        colorOption.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
            colorOption.classList.add('selected');
        });
        colorOptions.appendChild(colorOption);
    });
    
    // Set size options
    const sizeOptions = document.querySelector('.size-options');
    sizeOptions.innerHTML = '';
    
    product.sizes.forEach((size, index) => {
        const sizeOption = document.createElement('button');
        sizeOption.className = 'size-option';
        if (index === 0) sizeOption.classList.add('selected');
        sizeOption.textContent = size;
        sizeOption.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(s => s.classList.remove('selected'));
            sizeOption.classList.add('selected');
        });
        sizeOptions.appendChild(sizeOption);
    });
    
    // Set up add to cart button
    const addToCartBtn = document.querySelector('.action-buttons .btn');
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.onclick = () => {
        const selectedColor = document.querySelector('.color-option.selected').style.backgroundColor;
        const selectedSize = document.querySelector('.size-option.selected').textContent;
        const quantity = parseInt(document.querySelector('.quantity-selector input').value) || 1;
        
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            color: selectedColor,
            size: selectedSize,
            quantity: quantity
        });
        
        closeModal();
    };
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Product Modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add to Cart
function addToCart(item) {
    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => 
        cartItem.id === item.id && 
        cartItem.color === item.color && 
        cartItem.size === item.size
    );
    
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }
    
    updateCartCount();
    renderCartItems();
}

// Update Cart Count
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
}

// Render Cart Items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div>Color: <span style="display: inline-block; width: 15px; height: 15px; background-color: ${item.color}; border: 1px solid #ddd;"></span></div>
                <div>Size: ${item.size}</div>
                <div>Qty: ${item.quantity}</div>
                <button class="cart-item-remove" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}">Remove</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const color = btn.getAttribute('data-color');
            const size = btn.getAttribute('data-size');
            
            cart = cart.filter(item => 
                !(item.id === id && item.color === color && item.size === size)
            );
            
            updateCartCount();
            renderCartItems();
        });
    });
    
    // Update total
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);