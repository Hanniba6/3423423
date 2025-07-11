// Hanniba - Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    // Check user authentication status
    checkAuthStatus();
    
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Debug: Log storage at page load
    console.log('LocalStorage at page load:');
    console.log('Current user:', localStorage.getItem('currentUser'));
    console.log('Cart data:', localStorage.getItem('cart'));
    console.log('Products data:', localStorage.getItem('products'));
    
    // If it's an auth-required page and user is not logged in, redirect to home page
    if ((currentPath.includes('cart.html') || 
         currentPath.includes('confirmation.html') || 
         currentPath.includes('logout.html')) && 
        !isAuthenticated()) {
        window.location.href = 'index.html';
    }
    
    // Set active navigation link
    setActiveNavLink();
    
    // Load featured courses
    loadFeaturedCourses123();
    
    // Handle resource details view
    handleResourceDetails();
    
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 检查URL参数是否需要打开登录表单
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'true') {
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.click();
        }
    }
    
    // 导航链接悬停效果增强
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transition = 'all 0.3s ease';
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
});

// Set current page navigation link to active
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('currentUser') !== null;
}

// Check authentication status and update UI
function checkAuthStatus() {
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    
    if (isAuthenticated()) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (authLinks) authLinks.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'block';
            if (usernameDisplay) {
                usernameDisplay.textContent = currentUser.username;
            }
        }
    } else {
        if (authLinks) authLinks.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// Load featured courses
function loadFeaturedCourses123() {
    const featuredCoursesContainer = document.getElementById('featured-courses');
    if (!featuredCoursesContainer) return;
    
    // Get courses from localStorage or fetch from server
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    // If no courses in localStorage, fetch from server
    if (courses.length === 0) {
        fetch('data/courses.json')
            .then(response => response.json())
            .then(data => {
                // Save courses to localStorage
                localStorage.setItem('courses', JSON.stringify(data));
                
                // Display featured courses (first 4)
                displayFeaturedCourses123(data.slice(0, 4));
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
                featuredCoursesContainer.innerHTML = '<p>Failed to load courses. Please try again later.</p>';
            });
    } else {
        // Display featured courses (first 4)
        displayFeaturedCourses123(courses.slice(0, 4));
    }
}

// Display featured courses
function displayFeaturedCourses123(courses) {
    const featuredCoursesContainer = document.getElementById('featured-courses');
    if (!featuredCoursesContainer) return;
    
    featuredCoursesContainer.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        
        courseCard.innerHTML = `
            <div class="course-image">
                <img src="${course.image}" alt="${course.name}" onerror="this.src='img/placeholder.jpg'">
            </div>
            <div class="course-info">
                <h3>${course.name}</h3>
                <p class="course-duration">${course.duration}</p>
                <p class="course-price">$${course.price.toFixed(2)}</p>
                <p class="course-description">${course.description}</p>
                <div class="course-actions">
                    <a href="courses.html" class="btn">View Details</a>
                    <button class="btn add-to-cart" data-id="${course.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        featuredCoursesContainer.appendChild(courseCard);
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