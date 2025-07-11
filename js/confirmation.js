// Order confirmation page JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    // Verify if user is logged in
    checkAuthentication123();
    
    // Load temporary order data to confirmation page
    loadOrderDetails123();
    
    // Edit order button event
    const editOrderBtn = document.getElementById('edit-order');
    if (editOrderBtn) {
        editOrderBtn.addEventListener('click', editOrder123);
    }
    
    // Confirm order button event
    const confirmOrderBtn = document.getElementById('confirm-order');
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', confirmOrder123);
    }
    
    // Delivery method change event - update total price
    const deliveryOptions = document.querySelectorAll('input[name="delivery-method"]');
    if (deliveryOptions) {
        deliveryOptions.forEach(option => {
            option.addEventListener('change', updateTotalWithDelivery123);
        });
    }
});

// Check if user is logged in, redirect to home page if not
function checkAuthentication123() {
    // Check login status using sessionStorage
    if (!sessionStorage.getItem('isLoggedIn')) {
        alert('Please login to access the order confirmation page!');
        window.location.href = 'index.html';
    }
}

// Load temporary order details to confirmation page
function loadOrderDetails123() {
    const orderItems = document.getElementById('order-items');
    const orderTotalAmount = document.getElementById('order-total-amount');
    
    if (!orderItems || !orderTotalAmount) return;
    
    const tempOrder = JSON.parse(localStorage.getItem('tempOrder') || 'null');
    
    if (!tempOrder) {
        orderItems.innerHTML = '<p class="empty-order">No order data</p>';
        orderTotalAmount.textContent = '$0.00';
        // Disable confirm order button
        const confirmOrderBtn = document.getElementById('confirm-order');
        if (confirmOrderBtn) {
            confirmOrderBtn.disabled = true;
            confirmOrderBtn.classList.add('btn-disabled');
        }
        return;
    }
    
    orderItems.innerHTML = '';
    let total = 0;
    
    tempOrder.items.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        if (item.type === 'resource') {
            // Display resource item
            orderItem.innerHTML = `
                <div class="order-item-details">
                    <p class="order-item-title">${item.name || item.resourceName}</p>
                    <p class="order-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div class="order-item-quantity">
                    <p>$${item.subtotal.toFixed(2)}</p>
                </div>
            `;
            total += item.subtotal;
        } else {
            // Display course item
            orderItem.innerHTML = `
                <div class="order-item-details">
                    <p class="order-item-title">${item.name}</p>
                    <p class="order-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div class="order-item-quantity">
                    <p>$${item.subtotal.toFixed(2)}</p>
                </div>
            `;
            total += item.subtotal;
        }
        
        orderItems.appendChild(orderItem);
    });
    
    // Save original order total (without delivery fee)
    tempOrder.subtotal = total;
    tempOrder.total = total;
    localStorage.setItem('tempOrder', JSON.stringify(tempOrder));
    
    // Display total
    orderTotalAmount.textContent = `$${total.toFixed(2)}`;
    
    // Ensure confirm button is enabled
    const confirmOrderBtn = document.getElementById('confirm-order');
    if (confirmOrderBtn) {
        confirmOrderBtn.disabled = false;
        confirmOrderBtn.classList.remove('btn-disabled');
    }
}

// Update total price based on delivery option
function updateTotalWithDelivery123() {
    const tempOrder = JSON.parse(localStorage.getItem('tempOrder') || 'null');
    if (!tempOrder) return;
    
    const orderTotalAmount = document.getElementById('order-total-amount');
    if (!orderTotalAmount) return;
    
    // Get selected delivery method
    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
    
    // Calculate new total
    let newTotal = tempOrder.subtotal || tempOrder.total;
    
    // Add extra fee if both delivery methods are selected
    if (deliveryMethod === 'both') {
        newTotal += 15.00;
    }
    
    // Update displayed total
    orderTotalAmount.textContent = `$${newTotal.toFixed(2)}`;
    
    // Update total in temporary order
    tempOrder.total = newTotal;
    tempOrder.deliveryMethod = deliveryMethod;
    localStorage.setItem('tempOrder', JSON.stringify(tempOrder));
}

// Edit order (return to cart page)
function editOrder123() {
    window.location.href = 'cart.html';
}

// Confirm order
function confirmOrder123() {
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    const deliveryForm = document.getElementById('delivery-form');
    
    if (!shippingForm || !paymentForm || !deliveryForm) return;
    
    // Simple form validation
    const fullName = document.getElementById('full-name').value;
    const contactPerson = document.getElementById('contact-person').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postal-code').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    if (!fullName || !contactPerson || !address || !city || !postalCode || !phone || !email) {
        alert('Please fill in all organization and contact information!');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }
    
    // Get temporary order
    const tempOrder = JSON.parse(localStorage.getItem('tempOrder') || 'null');
    
    if (!tempOrder) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Get payment method
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Get delivery method
    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
    
    // Create complete order
    const order = {
        ...tempOrder,
        status: 'confirmed',
        dateConfirmed: new Date().toISOString(),
        institution: {
            name: fullName,
            contactPerson,
            address,
            city,
            postalCode,
            phone,
            email
        },
        payment: {
            method: paymentMethod
        },
        delivery: {
            method: deliveryMethod
        }
    };
    
    // Save to order history
    saveOrder123(order);
    
    // Clear cart and temporary order
    localStorage.setItem('cart', '[]');
    localStorage.removeItem('tempOrder');
    
    alert('Order confirmed! Thank you for your purchase.');
    window.location.href = 'orders.html';
}

// Save order to history
function saveOrder123(order) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
} 