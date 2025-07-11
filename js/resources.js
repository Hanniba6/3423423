// Resources JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Load resources data
    loadResourcesData();
    
    // Handle resource details view
    handleResourceDetails();
    
    // Handle add to cart functionality
    handleAddToCart();
});

// Load resources data from JSON file
function loadResourcesData() {
    // Check if we are on the resources page
    const resourcesList = document.getElementById('resources-list');
    if (!resourcesList) return;
    
    // Get resources from localStorage or fetch from server
    let resources = JSON.parse(localStorage.getItem('resources') || '[]');
    
    // If no resources in localStorage, fetch from server
    if (resources.length === 0) {
        fetch('data/resources.json')
            .then(response => response.json())
            .then(data => {
                // Save resources to localStorage
                localStorage.setItem('resources', JSON.stringify(data));
                
                // Use the resources data
                resources = data;
                
                // Check if resources are already displayed
                const resourceCards = resourcesList.querySelectorAll('.resource-card');
                if (resourceCards.length === 0) {
                    // Display resources dynamically if not already displayed
                    displayResources(resources);
                }
            })
            .catch(error => {
                console.error('Error fetching resources data:', error);
                resourcesList.innerHTML = '<p>Failed to load resources. Please try again later.</p>';
            });
    } else {
        // Check if resources are already displayed
        const resourceCards = resourcesList.querySelectorAll('.resource-card');
        if (resourceCards.length === 0) {
            // Display resources dynamically if not already displayed
            displayResources(resources);
        }
    }
}

// Display resources
function displayResources(resources) {
    const resourcesList = document.getElementById('resources-list');
    if (!resourcesList) return;
    
    // Clear container
    resourcesList.innerHTML = '';
    
    // Display all resources
    resources.forEach(resource => {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card';
        
        resourceCard.innerHTML = `
            <div class="resource-image">
                <img src="${resource.image}" alt="${resource.name}" onerror="this.src='img/placeholder.jpg'">
            </div>
            <div class="resource-info">
                <h3>${resource.name} (${resource.code})</h3>
                <p class="resource-price">$${resource.price.toFixed(2)}</p>
                <p class="resource-description">${resource.description}</p>
                <p>Official Website: <a href="${resource.website}" target="_blank">training.gov.au</a></p>
                <div class="resource-actions">
                    <button class="btn view-details" data-id="${resource.id}">View Details</button>
                    <button class="btn add-to-cart" data-id="${resource.id}" data-name="${resource.name}" data-price="${resource.price.toFixed(2)}">Add to Cart</button>
                </div>
            </div>
            <div class="resource-details" id="details-${resource.id}" style="display: none;">
                <div class="details-section">
                    <h4>Resource Content</h4>
                    <p>${resource.content}</p>
                </div>
                <div class="details-section">
                    <h4>Key Features</h4>
                    <ul>
                        ${resource.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        resourcesList.appendChild(resourceCard);
    });
}

// Handle resource details view
function handleResourceDetails() {
    // Add click event listener to view details buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details')) {
            const resourceId = e.target.getAttribute('data-id');
            toggleResourceDetails(resourceId);
        }
    });
}

// Toggle resource details visibility
function toggleResourceDetails(resourceId) {
    const detailsElement = document.getElementById(`details-${resourceId}`);
    if (detailsElement) {
        const isVisible = detailsElement.style.display !== 'none';
        
        // Hide all resource details first
        const allDetails = document.querySelectorAll('.resource-details');
        allDetails.forEach(detail => {
            detail.style.display = 'none';
            detail.classList.remove('details-showing');
        });
        
        // Show the clicked resource details if it was hidden
        if (!isVisible) {
            detailsElement.style.display = 'block';
            detailsElement.classList.add('details-showing');
            
            // Scroll to the details
            setTimeout(() => {
                detailsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
}

// Handle add to cart functionality
function handleAddToCart() {
    // Add click event listener to add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const resourceId = e.target.getAttribute('data-id');
            const resourceName = e.target.getAttribute('data-name');
            const resourcePrice = parseFloat(e.target.getAttribute('data-price'));
            
            addResourceToCart(resourceId, resourceName, resourcePrice);
        }
    });
}

// Add resource to cart
function addResourceToCart(resourceId, resourceName, resourcePrice) {
    // Check login status
    if (!localStorage.getItem('currentUser')) {
        alert('Please login first to add resources to your cart!');
        return;
    }
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if resource already in cart
    const resourceIndex = cart.findIndex(item => item.resourceId === resourceId);
    
    if (resourceIndex !== -1) {
        // Resource already in cart, increase quantity
        cart[resourceIndex].quantity += 1;
    } else {
        // Add new resource to cart
        cart.push({
            resourceId: resourceId,
            resourceName: resourceName,
            price: resourcePrice,
            quantity: 1,
            type: 'resource',
            dateAdded: new Date().toISOString()
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show confirmation
    alert(`${resourceName} has been added to your cart!`);
} 