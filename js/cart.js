// Shopping Cart JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Load cart contents
    loadCart123();
    
    // Clear cart button event
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart123);
    }
    
    // Checkout button event
    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout123);
    }
    
    // Cart item event delegation (change quantity, delete)
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.addEventListener('click', function(e) {
            // Increase quantity
            if (e.target.classList.contains('increase-quantity')) {
                const itemId = e.target.getAttribute('data-id');
                const itemType = e.target.getAttribute('data-type') || 'course';
                updateCartItemQuantity123(itemId, 1, itemType);
            }
            
            // Decrease quantity
            if (e.target.classList.contains('decrease-quantity')) {
                const itemId = e.target.getAttribute('data-id');
                const itemType = e.target.getAttribute('data-type') || 'course';
                updateCartItemQuantity123(itemId, -1, itemType);
            }
            
            // Remove item
            if (e.target.classList.contains('cart-item-remove')) {
                const itemId = e.target.getAttribute('data-id');
                const itemType = e.target.getAttribute('data-type') || 'course';
                removeFromCart123(itemId, itemType);
            }
        });
    }
    
    // Verify if user is logged in
    checkAuthentication123();
    
    // Load recommended courses
    loadRecommendedCourses123();

    // Add to cart buttons for resources
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const itemId = e.target.getAttribute('data-id');
            const itemName = e.target.getAttribute('data-name');
            const itemPrice = parseFloat(e.target.getAttribute('data-price'));
            const itemType = itemId.startsWith('resource') ? 'resource' : 'course';
            
            if (itemType === 'resource') {
                addResourceToCart(itemId, itemName, itemPrice);
            } else {
                addToCart123(itemId);
            }
        }
    });
});

// Add resource to cart
function addResourceToCart(resourceId, resourceName, resourcePrice) {
    // Check login status
    if (!sessionStorage.getItem('isLoggedIn')) {
        alert('请先登录以添加商品到购物车！');
        // Redirect to index.html with login parameter
        window.location.href = 'index.html?login=true';
        return;
    }
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Get resource data to include description
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const resource = resources.find(r => r.id === resourceId);
    let resourceDescription = '';
    
    if (resource) {
        resourceDescription = resource.description || '';
    }
    
    // Check if resource already in cart
    const resourceIndex = cart.findIndex(item => item.resourceId === resourceId);
    
    if (resourceIndex !== -1) {
        // Resource already in cart, increase quantity
        cart[resourceIndex].quantity += 1;
        alert(`已增加 ${resourceName} 的数量！`);
    } else {
        // Add new resource to cart
        cart.push({
            resourceId: resourceId,
            resourceName: resourceName,
            description: resourceDescription,
            price: resourcePrice,
            quantity: 1,
            type: 'resource',
            dateAdded: new Date().toISOString()
        });
        alert(`${resourceName} 已添加到购物车！`);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Check if user is logged in, redirect to home page if not
function checkAuthentication123() {
    // Only check login status on cart.html page
    if (window.location.pathname.includes('cart.html')) {
        // Check login status using sessionStorage
        if (!sessionStorage.getItem('isLoggedIn')) {
            alert('Please login to access your cart!');
            window.location.href = 'index.html';
        }
    }
}

// Load cart contents
function loadCart123() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    
    if (!cartItemsContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotalAmount) cartTotalAmount.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        if (item.type === 'resource') {
            // Handle resource items
            const resource = resources.find(r => r.id === item.resourceId);
            
            // If resource data is available from JSON, use it
            if (resource) {
                const itemTotal = resource.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${resource.image}" alt="${resource.name}" onerror="this.src='img/placeholder.jpg'">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${resource.name}</h3>
                        <p class="cart-item-description">${resource.description}</p>
                        <p class="cart-item-price">Price: $${resource.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <label>Quantity: </label>
                            <span class="quantity-btn decrease-quantity" data-id="${resource.id}" data-type="resource">-</span>
                            <span class="quantity-value">${item.quantity}</span>
                            <span class="quantity-btn increase-quantity" data-id="${resource.id}" data-type="resource">+</span>
                            <span class="cart-item-remove" data-id="${resource.id}" data-type="resource">Remove</span>
                        </div>
                    </div>
                    <div class="cart-item-subtotal">
                        <p>Subtotal: $${itemTotal.toFixed(2)}</p>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            } else {
                // Fallback to using the data stored in the cart item
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="img/resources/${item.resourceId}.jpg" alt="${item.resourceName}" onerror="this.src='img/placeholder.jpg'">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.resourceName}</h3>
                        <p class="cart-item-description">${item.description || 'No description available'}</p>
                        <p class="cart-item-price">Price: $${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <label>Quantity: </label>
                            <span class="quantity-btn decrease-quantity" data-id="${item.resourceId}" data-type="resource">-</span>
                            <span class="quantity-value">${item.quantity}</span>
                            <span class="quantity-btn increase-quantity" data-id="${item.resourceId}" data-type="resource">+</span>
                            <span class="cart-item-remove" data-id="${item.resourceId}" data-type="resource">Remove</span>
                        </div>
                    </div>
                    <div class="cart-item-subtotal">
                        <p>Subtotal: $${itemTotal.toFixed(2)}</p>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            }
        } else {
            // Handle course items
            const course = courses.find(c => c.id === item.courseId);
            if (!course) return;
            
            const itemTotal = course.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${course.image}" alt="${course.name}" onerror="this.src='img/placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${course.name}</h3>
                    <p class="cart-item-description">${course.description}</p>
                    <p class="cart-item-price">Price: $${course.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <label>Quantity: </label>
                        <span class="quantity-btn decrease-quantity" data-id="${course.id}" data-type="course">-</span>
                        <span class="quantity-value">${item.quantity}</span>
                        <span class="quantity-btn increase-quantity" data-id="${course.id}" data-type="course">+</span>
                        <span class="cart-item-remove" data-id="${course.id}" data-type="course">Remove</span>
                    </div>
                </div>
                <div class="cart-item-subtotal">
                    <p>Subtotal: $${itemTotal.toFixed(2)}</p>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        }
    });
    
    if (cartTotalAmount) {
        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
    }
}

// Update cart item quantity
function updateCartItemQuantity123(itemId, change, itemType = 'course') {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let itemIndex;
    
    if (itemType === 'resource') {
        itemIndex = cart.findIndex(item => item.resourceId === itemId);
    } else {
        itemIndex = cart.findIndex(item => item.courseId === itemId);
    }
    
    if (itemIndex === -1) return;
    
    cart[itemIndex].quantity += change;
    
    // If quantity is less than or equal to 0, remove item
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Reload cart
    loadCart123();
}

// Remove item from cart
function removeFromCart123(itemId, itemType = 'course') {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let newCart;
    
    if (itemType === 'resource') {
        newCart = cart.filter(item => item.resourceId !== itemId);
    } else {
        newCart = cart.filter(item => item.courseId !== itemId);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Reload cart
    loadCart123();
}

// Clear cart
function clearCart123() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.setItem('cart', '[]');
        loadCart123();
    }
}

// Calculate cart total
function calculateCartTotal123() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    
    let total = 0;
    
    cart.forEach(item => {
        if (item.type === 'resource') {
            // Try to get resource from resources.json first
            const resource = resources.find(r => r.id === item.resourceId);
            if (resource) {
                total += resource.price * item.quantity;
            } else {
                // Fallback to using the price stored in the cart item
                total += item.price * item.quantity;
            }
        } else {
            const course = courses.find(c => c.id === item.courseId);
            if (course) {
                total += course.price * item.quantity;
            }
        }
    });
    
    return total;
}

// Load recommended courses
function loadRecommendedCourses123() {
    const recommendedCoursesContainer = document.getElementById('recommended-courses');
    if (!recommendedCoursesContainer) return;
    
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Filter out courses that are already in cart
    const cartCourseIds = cart.map(item => item.courseId);
    const availableCourses = courses.filter(course => !cartCourseIds.includes(course.id));
    
    // Display up to 4 recommended courses
    const recommendedCourses = availableCourses.slice(0, 4);
    
    recommendedCoursesContainer.innerHTML = '';
    
    recommendedCourses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'course-card';
        
        courseElement.innerHTML = `
            <img src="${course.image}" alt="${course.name}" onerror="this.src='img/placeholder.jpg'">
            <h3>${course.name}</h3>
            <p class="course-price">$${course.price.toFixed(2)}</p>
            <button class="btn add-to-cart" data-id="${course.id}">Add to Cart</button>
        `;
        
        recommendedCoursesContainer.appendChild(courseElement);
    });
    
    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = recommendedCoursesContainer.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-id');
            addToCart123(courseId);
        });
    });
}

// Add course to cart
function addToCart123(courseId) {
    // Check login status
    if (!localStorage.getItem('currentUser')) {
        alert('Please login first to add courses to your cart!');
        return;
    }
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Get course data to include description
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        alert('Course not found!');
        return;
    }
    
    const existingItem = cart.find(item => item.courseId === courseId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        alert(`Increased quantity of ${course.name} in your cart!`);
    } else {
        cart.push({
            courseId: courseId,
            name: course.name,
            description: course.description,
            price: course.price,
            quantity: 1,
            type: 'course',
            dateAdded: new Date().toISOString()
        });
        alert(`${course.name} has been added to your cart!`);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart123();
    loadRecommendedCourses123();
}

// Proceed to checkout
function proceedToCheckout123() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to proceed with checkout!');
        return;
    }
    
    // Get courses and resources data to calculate accurate prices
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    
    // Create detailed items list with calculated subtotals
    const detailedItems = cart.map(item => {
        if (item.type === 'resource') {
            // Find resource data
            const resource = resources.find(r => r.id === item.resourceId);
            if (resource) {
                return {
                    ...item,
                    name: resource.name,
                    price: resource.price,
                    subtotal: resource.price * item.quantity
                };
            } else {
                return {
                    ...item,
                    subtotal: item.price * item.quantity
                };
            }
        } else {
            // Find course data
            const course = courses.find(c => c.id === item.courseId);
            if (course) {
                return {
                    ...item,
                    name: course.name,
                    price: course.price,
                    subtotal: course.price * item.quantity
                };
            } else {
                return {
                    ...item,
                    subtotal: 0
                };
            }
        }
    });
    
    // Calculate total
    const total = calculateCartTotal123();
    
    // Save order data
    const orderData = {
        orderId: 'ORD-' + Date.now(),
        id: 'ORD-' + Date.now(), // Adding id field for compatibility with existing code
        username: currentUser.email,
        customer: {
            id: currentUser.id,
            email: currentUser.email,
            fullname: currentUser.fullname,
            phone: currentUser.phone,
            address: currentUser.address
        },
        items: detailedItems,
        total: total,
        subtotal: total,
        status: 'Processing',
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString()
    };
    
    // Save temporary order
    localStorage.setItem('tempOrder', JSON.stringify(orderData));
    
    // Redirect to confirmation page
    window.location.href = 'confirmation.html';
} 