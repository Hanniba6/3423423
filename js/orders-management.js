// Orders Management JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Verify user is logged in
    checkAuthentication123();
    
    // Load orders list
    loadOrders123();
    
    // Display user name
    displayUserName();
    
    // Download orders button event
    const downloadBtn = document.getElementById('download-orders');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadOrders123);
    }
    
    // Clear data button event
    const clearDataBtn = document.getElementById('clear-data');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearUserData123);
    }
    
    // Logout button event
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout123);
    }
});

// Check if user is logged in, redirect to home page if not
function checkAuthentication123() {
    // Check login status using sessionStorage
    if (!sessionStorage.getItem('isLoggedIn')) {
        alert('Please log in to access the order management page!');
        window.location.href = 'index.html';
    }
}

// Display user name
function displayUserName() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Display user name
    const userFullname = document.getElementById('user-fullname');
    if (userFullname) {
        userFullname.textContent = currentUser.fullname || currentUser.email || currentUser.username || 'User';
    }
    
    // Display username in nav
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = currentUser.fullname || currentUser.email || currentUser.username || 'User';
    }
}

// Load user orders
function loadOrders123() {
    const orderList = document.getElementById('order-list');
    if (!orderList) return;
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('User information not found!');
        return;
    }
    
    // Get orders data
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Filter orders for current user
    const userOrders = orders.filter(order => 
        order.username === currentUser.email || 
        (order.customer && order.customer.email === currentUser.email)
    );
    
    // Clear order list
    orderList.innerHTML = '';
    
    if (userOrders.length === 0) {
        orderList.innerHTML = '<p class="no-orders">You don\'t have any orders yet</p>';
        return;
    }
    
    // Sort by date descending (newest first)
    userOrders.sort((a, b) => {
        const dateA = a.dateConfirmed || a.dateCreated || a.date || "";
        const dateB = b.dateConfirmed || b.dateCreated || b.date || "";
        return new Date(dateB) - new Date(dateA);
    });
    
    // Add orders to list
    userOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Calculate total items in order
        const itemCount = order.items.reduce((total, item) => total + (item.quantity || 0), 0);
        
        // Format date
        const orderDate = new Date(order.dateConfirmed || order.dateCreated || order.date);
        const formattedDate = orderDate.toLocaleString();
        
        // Get order status
        const status = order.status || "Processing";
        
        orderCard.innerHTML = `
            <div class="order-header">
                <h3>Order ID: ${order.orderId || order.id}</h3>
                <span class="order-status ${status.toLowerCase()}">${status}</span>
            </div>
            <div class="order-info">
                <p>Date: ${formattedDate}</p>
                <p>Items: ${itemCount}</p>
                <p>Total: $${(order.total || 0).toFixed(2)}</p>
            </div>
            <button class="btn btn-view-details" data-id="${order.orderId || order.id}">View Details</button>
        `;
        
        orderList.appendChild(orderCard);
    });
    
    // Add view details button events
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    viewDetailsButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            viewOrderDetails123(orderId);
        });
    });
}

// View order details
function viewOrderDetails123(orderId) {
    // Get order data
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId || o.orderId === orderId);
    
    if (!order) {
        alert('Order not found!');
        return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Format date
    const orderDate = new Date(order.dateConfirmed || order.dateCreated || order.date);
    const formattedDate = orderDate.toLocaleString();
    
    // Get status
    const status = order.status || "Processing";
    
    // Build order items HTML
    let orderItemsHTML = '';
    order.items.forEach(item => {
        // Determine item name and price based on type
        let itemName, itemPrice, itemSubtotal;
        
        if (item.type === 'resource') {
            itemName = item.name || item.resourceName || "Resource";
            itemPrice = item.price || 0;
            itemSubtotal = item.subtotal || (itemPrice * (item.quantity || 1));
        } else {
            itemName = item.name || "Course";
            itemPrice = item.price || 0;
            itemSubtotal = item.subtotal || (itemPrice * (item.quantity || 1));
        }
        
        orderItemsHTML += `
            <div class="order-detail-item">
                <div class="item-info">
                    <span class="item-name">${itemName}</span>
                    <span class="item-price">$${itemPrice.toFixed(2)} × ${item.quantity || 1}</span>
                </div>
                <div class="item-subtotal">
                    $${itemSubtotal.toFixed(2)}
                </div>
            </div>
        `;
    });
    
    // Get customer info
    const customerName = order.customer ? (order.customer.fullname || order.customer.email) : (order.username || "Customer");
    
    // Build modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="order-details">
                <h2>Order Details</h2>
                <div class="order-summary">
                    <p><strong>Order ID:</strong> ${order.orderId || order.id}</p>
                    <p><strong>Customer:</strong> ${customerName}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Status:</strong> ${status}</p>
                </div>
                
                <div class="order-items">
                    <h3>Order Items</h3>
                    ${orderItemsHTML}
                </div>
                
                <div class="order-total">
                    <h3>Total: $${(order.total || 0).toFixed(2)}</h3>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Add close modal event
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Download order history
function downloadOrders123() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('User information not found!');
        return;
    }
    
    // Get orders data
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Filter orders for current user
    const userOrders = orders.filter(order => 
        order.username === currentUser.email || 
        (order.customer && order.customer.email === currentUser.email)
    );
    
    if (userOrders.length === 0) {
        alert('You don\'t have any orders to download!');
        return;
    }
    
    // Create export data
    const exportData = {
        user: {
            id: currentUser.id,
            email: currentUser.email,
            fullname: currentUser.fullname
        },
        orders: userOrders.map(order => ({
            orderId: order.orderId || order.id,
            date: order.dateConfirmed || order.dateCreated || order.date,
            status: order.status || 'Processing',
            total: order.total || 0,
            items: order.items.map(item => ({
                name: item.name || item.resourceName || (item.courseId ? `Course ID: ${item.courseId}` : `Resource ID: ${item.resourceId}`),
                price: item.price || 0,
                quantity: item.quantity || 1,
                subtotal: item.subtotal || 0,
                type: item.type || (item.courseId ? 'course' : 'resource')
            }))
        })),
        exportDate: new Date().toISOString()
    };
    
    // Convert to JSON
    const jsonContent = JSON.stringify(exportData, null, 2);
    
    // Create file
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `order_history_${currentUser.email.split('@')[0]}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    
    // Click link and remove
    a.click();
    document.body.removeChild(a);
    
    // Release URL object
    URL.revokeObjectURL(url);
}

// Clear user data
function clearUserData123() {
    if (!confirm('Are you sure you want to clear your cart and order history? This action cannot be undone.')) {
        return;
    }
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Clear orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = orders.filter(order => 
        order.username !== currentUser.email && 
        (!order.customer || order.customer.email !== currentUser.email)
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Reload page
    alert('Cart and order history cleared!');
    location.reload();
}

// Logout function
function logout123() {
    // Clear session
    sessionStorage.removeItem('isLoggedIn');
    
    // Alert user
    alert('You have successfully logged out!');
    
    // Redirect to home page
    window.location.href = 'index.html';
} 