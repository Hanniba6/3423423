// Course related JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    console.log("Loading courses page...");
    
    // Always force reinitialize course data, ensure all 8 courses are loaded
    console.log("Force reinitializing all course data...");
    
    // Initialize and load course data - this step is critical to ensure all 8 courses are loaded
    initCourses123();
    
    // Course interactions event delegation
    const coursesList = document.getElementById('courses-list');
    if (coursesList) {
        console.log("Found courses list container, initializing button events...");
        coursesList.addEventListener('click', function(e) {
            // View details button
            if (e.target.classList.contains('view-details')) {
                const courseId = e.target.getAttribute('data-id');
                toggleCourseDetails123(courseId);
            }
            
            // Add to cart button
            if (e.target.classList.contains('add-to-cart')) {
                const courseId = e.target.getAttribute('data-id');
                addCourseToCart123(courseId);
            }
        });
    } 
    
    // Handle featured courses on home page
    const featuredCourses = document.getElementById('featured-courses');
    if (featuredCourses) {
        console.log("Found featured courses container, initializing button events...");
        featuredCourses.addEventListener('click', function(e) {
            // Add to cart button
            if (e.target.classList.contains('add-to-cart')) {
                const courseId = e.target.getAttribute('data-id');
                addCourseToCart123(courseId);
            }
        });
    }
});

// Initialize course data - load from JSON file
function initCourses123() {
    // 每次刷新页面时都强制从JSON文件重新加载课程数据
    console.log('Reloading course data, ensuring all 8 courses are displayed...');
    
    // 先清除缓存中的旧数据
    localStorage.removeItem('courses');
    
    // Try to load course data from JSON file
    fetch('data/courses.json')
        .then(response => {
            // Check if response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 输出从JSON加载的课程数量
            console.log(`Loaded ${data.length} courses from courses.json`);
            
            // Save data to localStorage
            localStorage.setItem('courses', JSON.stringify(data));
            
            // Load courses to page
            loadCourses123();
        })
        .catch(error => {
            console.error('Failed to load course data:', error);
            
            // Error handling: If cannot load from file, check if data exists in localStorage
            if (!localStorage.getItem('courses')) {
                // If no data in localStorage, use fallback data
                const fallbackCourses = [
                    {
                        id: "course-001",
                        name: "Certificate II in Applied Digital Technologies (ICT20120)",
                        description: "This qualification provides the skills and knowledge for individuals to be competent in a wide range of basic digital technologies in various contexts.",
                        duration: "6-12 months",
                        price: 1299.99,
                        image: "img/courses/ict20120.jpg"
                    },
                    {
                        id: "course-002",
                        name: "Certificate III in Information Technology (ICT30120)",
                        description: "This qualification provides entry-level skills and knowledge for individuals to be competent in a range of Information Technology technical functions.",
                        duration: "12-18 months",
                        price: 1999.99,
                        image: "img/courses/ict30120.jpg"
                    },
                    {
                        id: "course-003",
                        name: "Certificate IV in Information Technology (ICT40120)",
                        description: "This qualification provides the skills and knowledge for an individual to be competent in a wide range of general ICT technologies and to work within specialized areas.",
                        duration: "12-24 months",
                        price: 2499.99,
                        image: "img/courses/ict40120.jpg"
                    },
                    {
                        id: "course-004",
                        name: "Diploma of Information Technology (ICT50220)",
                        description: "This qualification provides the skills and knowledge for an individual to administer and manage information and communications technology (ICT) infrastructure, systems, and networks in medium to large organizations.",
                        duration: "18-24 months",
                        price: 3299.99,
                        image: "img/courses/ict50220.jpg"
                    },
                    {
                        id: "course-005",
                        name: "Advanced Diploma of Information Technology (ICT60220)",
                        description: "This qualification provides high-level information and communications technology (ICT) skills and knowledge for an individual to be competent in advanced technical and theoretical concepts in ICT.",
                        duration: "24-36 months",
                        price: 3999.99,
                        image: "img/courses/ict60220.jpg"
                    },
                    {
                        id: "course-006",
                        name: "Certificate IV in Cyber Security (22603VIC)",
                        description: "This qualification provides the cybersecurity skills and knowledge for an individual to work as a cybersecurity technician who supports information security in an organization.",
                        duration: "12-18 months",
                        price: 2799.99,
                        image: "img/courses/22603vic.jpg"
                    },
                    {
                        id: "course-007",
                        name: "Certificate III in Information Technology (ICT30115)",
                        description: "This qualification provides the foundation skills and knowledge for individuals to support information technology activities in the workplace across a wide range of ICT areas.",
                        duration: "12-18 months",
                        price: 1899.99,
                        image: "img/courses/ict30115.jpg"
                    },
                    {
                        id: "course-008",
                        name: "Diploma of Information Technology (ICT50115)",
                        description: "This qualification provides the skills and knowledge for an individual to administer and manage information and communications technology infrastructure in small-to-medium enterprises.",
                        duration: "18-24 months",
                        price: 3199.99,
                        image: "img/courses/ict50115.jpg"
                    }
                ];
                console.log(`Using backup data with ${fallbackCourses.length} courses`);
                localStorage.setItem('courses', JSON.stringify(fallbackCourses));
                loadCourses123();
            }
        });
}

// Load course data from localStorage and display on page
function loadCourses123() {
    console.log("Starting to load course data to page...");
    
    const coursesContainer = document.getElementById('courses-list');
    const featuredCoursesContainer = document.getElementById('featured-courses');
    
    if (!coursesContainer && !featuredCoursesContainer) {
        console.error("Could not find courses container elements");
        return;
    }
    
    let courses = JSON.parse(localStorage.getItem('courses') || '[]');
    console.log(`Retrieved ${courses.length} courses from localStorage`);
    
    // Sort courses to prioritize VET qualification courses (IDs from course-009 to course-016)
    courses.sort((a, b) => {
        // Check if course ID is in range course-009 to course-016
        const isVetCourseA = a.id >= "course-009" && a.id <= "course-016";
        const isVetCourseB = b.id >= "course-009" && b.id <= "course-016";
        
        if (isVetCourseA && !isVetCourseB) {
            return -1; // VET courses first
        } else if (!isVetCourseA && isVetCourseB) {
            return 1; // Non-VET courses last
        } 
        return a.id.localeCompare(b.id); // Sort same type courses by ID
    });
    
    // Display sorted course data in console for debugging
    console.table(courses.map(c => ({ id: c.id, name: c.name })));
    
    // Check if on courses.html page
    const isCoursePageUrl = window.location.pathname.includes('courses.html');
    console.log("Current URL:", window.location.pathname);
    console.log("Is on courses page:", isCoursePageUrl);
    
    // Show only 3 featured courses on homepage, all courses on courses page
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    
    // Important! On courses.html must display all courses
    // For homepage, prioritize showing VET courses, only display first 3
    const displayCourses = isHomePage ? courses.slice(0, 3) : courses;
    
    console.log('Current page:', window.location.pathname);
    console.log('Is homepage:', isHomePage);
    console.log(`Will display ${displayCourses.length}/${courses.length} courses`);
    
    // Handle different containers based on page
    const targetContainer = isHomePage ? featuredCoursesContainer : coursesContainer;
    
    if (targetContainer) {
        targetContainer.innerHTML = '';
        
        displayCourses.forEach((course, index) => {
            console.log(`Processing course ${index+1}/${displayCourses.length}:`, course.name);
            
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.id = `course-${course.id}`;
            
            // Create different HTML structure based on whether it's the homepage or courses page
            if (isHomePage) {
                courseCard.innerHTML = `
                    <div class="course-image">
                        <img src="${course.image}" alt="${course.name}" onerror="this.src='img/placeholder.jpg'">
                    </div>
                    <div class="course-info">
                        <h3>${course.name}</h3>
                        <p class="course-duration">${course.duration}</p>
                        <p class="course-price">$${course.price.toFixed(2)}</p>
                        <p class="course-description">${course.description.substring(0, 100)}${course.description.length > 100 ? '...' : ''}</p>
                        <div class="course-actions">
                            <a href="courses.html" class="btn btn-secondary">View Details</a>
                            <button class="btn btn-primary add-to-cart" data-id="${course.id}" data-name="${course.name}" data-price="${course.price}">Add to Cart</button>
                        </div>
                    </div>
                `;
            } else {
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
                            <button class="btn view-details" data-id="${course.id}">View Details</button>
                            <button class="btn add-to-cart" data-id="${course.id}">Add to Cart</button>
                        </div>
                    </div>
                    <div class="course-details" id="details-${course.id}" style="display: none;">
                        <div class="details-section">
                            <h4>Course Content</h4>
                            <p>${course.courseware || 'No detailed information available'}</p>
                        </div>
                        <div class="details-section">
                            <h4>Assessment Requirements</h4>
                            <p>${course.assessment || 'No detailed information available'}</p>
                        </div>
                        <div class="details-section">
                            <h4>Sample Projects</h4>
                            <ul>
                                ${course.sampleProjects ? course.sampleProjects.map(project => `<li>${project}</li>`).join('') : '<li>No sample projects available</li>'}
                            </ul>
                        </div>
                    </div>
                `;
            }
            
            targetContainer.appendChild(courseCard);
        });
        
        // If no course data, show message
        if (displayCourses.length === 0) {
            targetContainer.innerHTML = '<p class="no-data">No course data available</p>';
        }
        
        // Set up event listeners for featured courses on homepage
        if (isHomePage) {
            const addToCartButtons = targetContainer.querySelectorAll('.add-to-cart');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const courseId = this.getAttribute('data-id');
                    addCourseToCart123(courseId);
                });
            });
        }
    }
    
    // 显示加载的课程数量
    console.log(`课程加载完成: ${displayCourses.length}/${courses.length}`);
}

// Toggle course details display
function toggleCourseDetails123(courseId) {
    const detailsElement = document.getElementById(`details-${courseId}`);
    if (detailsElement) {
        // Get current state
        const isVisible = detailsElement.style.display !== 'none';
        
        // Toggle display state
        if (isVisible) {
            // Use CSS animation to hide details
            detailsElement.classList.add('details-hiding');
            setTimeout(() => {
                detailsElement.style.display = 'none';
                detailsElement.classList.remove('details-hiding');
            }, 300); // Match CSS animation duration
        } else {
            detailsElement.style.display = 'block';
            // Add display animation class
            detailsElement.classList.add('details-showing');
            setTimeout(() => {
                detailsElement.classList.remove('details-showing');
            }, 300);
        }
    }
}

// Add course to cart
function addCourseToCart123(courseId) {
    // Check if user is logged in
    if (!isAuthenticated123()) {
        alert('Please login first to add courses to your cart!');
        return;
    }
    
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const course = courses.find(c => c.id === courseId);
    if (!course) {
        console.error('Course not found:', courseId);
        return;
    }
    
    // Check if course is already in cart
    const cartItemIndex = cart.findIndex(item => item.courseId === courseId);
    
    if (cartItemIndex > -1) {
        // Already in cart, increment quantity
        cart[cartItemIndex].quantity += 1;
    } else {
        // Add new course to cart
        cart.push({
            courseId,
            quantity: 1,
            dateAdded: new Date().toISOString()
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show success message
    alert(`${course.name} has been added to your cart!`);
}

// Check if user is authenticated
function isAuthenticated123() {
    return localStorage.getItem('currentUser') !== null;
}

// Get course details
function getCourseById123(courseId) {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    return courses.find(c => c.id === courseId);
} 