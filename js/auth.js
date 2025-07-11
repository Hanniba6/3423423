// Hanniba - Authentication related JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Check if current page is logout page
    if (window.location.pathname.includes('logout.html')) {
        // Ensure user is logged out
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('isLoggedIn');
        
        // Redirect to home page after 3 seconds
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 3000);
    } else {
        // Normal initialization for other pages
        // Ensure users array exists in localStorage
        if (!localStorage.getItem('users')) {
            // Create default test user with encrypted password (Test@123)
            const testUser = {
                id: 'test-001',
                email: 'test@example.com',
                password: hashPassword('Test@123'),
                resetToken: null,
                resetExpiry: null
            };
            localStorage.setItem('users', JSON.stringify([testUser]));
        }
        
        // Initialize auth forms
        initializeAuthForms();
        
        // Check if user is logged in
        checkAuthentication123();
        
        // Check for URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('login') === 'true') {
            // Open login form if login=true is in URL
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            const authForms = document.getElementById('auth-forms');
            
            if (loginForm) loginForm.style.display = 'block';
            if (registerForm) registerForm.style.display = 'none';
            if (authForms) authForms.style.display = 'flex';
        }
    }
});

// Password encryption using SHA-256 (Simulated encryption for demonstration)
function hashPassword(password) {
    // In a real-world scenario, we would use a proper hashing library 
    // with salt and appropriate security measures
    // For this demo, we'll use a simple hash function
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return 'hashed_' + hash.toString(16); // Prefix to identify as hashed
}

// Password strength validation
function validatePasswordStrength(password) {
    // Check minimum length
    if (password.length < 12) {
        return { valid: false, message: 'Password must be at least 12 characters' };
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    // Check for number
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    
    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one special character' };
    }
    
    // Check for common passwords
    const commonPasswords = ['password123', '12345678', 'qwerty123'];
    if (commonPasswords.includes(password.toLowerCase())) {
        return { valid: false, message: 'Password is too simple or common, please use a more complex password' };
    }
    
    return { valid: true, message: 'Password strength is good' };
}

function initializeAuthForms() {
    // Get login and register buttons and form containers
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authForms = document.getElementById('auth-forms');
    const forgotPasswordBtn = document.getElementById('forgot-password');
    
    console.log('Login button:', loginBtn);
    console.log('Register button:', registerBtn);
    console.log('Login form:', loginForm);
    console.log('Register form:', registerForm);
    
    // Initially hide auth forms if user is logged in
    if (localStorage.getItem('currentUser')) {
        if (authForms) authForms.style.display = 'none';
    }
    
    // Login button click event
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Login button clicked');
            if (loginForm) {
                loginForm.style.display = 'block';
                console.log('Login form displayed');
            }
            if (registerForm) {
                registerForm.style.display = 'none';
                console.log('Register form hidden');
            }
            if (authForms) {
                authForms.style.display = 'flex';
            }
        });
    }
    
    // Register button click event
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Register button clicked');
            if (loginForm) {
                loginForm.style.display = 'none';
                console.log('Login form hidden');
            }
            if (registerForm) {
                registerForm.style.display = 'block';
                console.log('Register form displayed');
            }
            if (authForms) {
                authForms.style.display = 'flex';
            }
        });
    }
    
    // Forgot Password button click event
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = prompt('Please enter your email address to reset password:');
            if (email) {
                initiatePasswordReset(email);
            }
        });
    }
    
    // Login form submit handler
    const loginFormElement = document.getElementById('loginForm');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            console.log('Login attempt:', email);
            login123(email, password);
        });
    }

    // Register form submit handler
    const registerFormElement = document.getElementById('registerForm');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('register-username').value;
            const fullname = document.getElementById('register-fullname').value;
            const phone = document.getElementById('register-phone').value;
            const address = document.getElementById('register-address').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            // Check if required fields are filled
            if (!email || !fullname || !phone || !address || !password || !confirmPassword) {
                alert('Please fill in all required fields!');
                return;
            }
            
            // Check if password and confirmation match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Validate password strength
            const passwordValidation = validatePasswordStrength(password);
            if (!passwordValidation.valid) {
                alert(passwordValidation.message);
                return;
            }
            
            // Check if email contains in password (basic personal info check)
            const emailPrefix = email.split('@')[0].toLowerCase();
            if (password.toLowerCase().includes(emailPrefix) && emailPrefix.length > 3) {
                alert('Password cannot contain your email address information!');
                return;
            }
            
            console.log('Register attempt:', email);
            register123(email, fullname, phone, address, password);
        });
    }
    
    // Add password validation while typing
    const passwordInput = document.getElementById('register-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const result = validatePasswordStrength(this.value);
            const requirementElement = this.nextElementSibling;
            
            if (requirementElement && requirementElement.classList.contains('password-requirements')) {
                if (result.valid) {
                    requirementElement.style.color = 'green';
                    requirementElement.textContent = '✓ ' + result.message;
                } else {
                    requirementElement.style.color = 'red';
                    requirementElement.textContent = '✗ ' + result.message;
                }
            }
        });
    }
    
    // Add password match validation
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch123);
    }
}

function checkAuthentication123() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const authRequiredElements = document.querySelectorAll('.auth-required');
    const authForms = document.getElementById('auth-forms');

    console.log('Checking authentication for user:', currentUser);
    console.log('Auth links element:', authLinks);
    console.log('User info element:', userInfo);
    console.log('Auth forms element:', authForms);

    if (currentUser) {
        // User is logged in
        if (authLinks) authLinks.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'block';
            // Display full name if available, otherwise email
            const displayName = currentUser.fullname ? 
                currentUser.fullname : 
                currentUser.email.split('@')[0]; // Show only the part before @ for email
            usernameDisplay.textContent = displayName;
        }
        if (authRequiredElements) {
            authRequiredElements.forEach(element => {
                element.style.display = 'block';
            });
        }
        if (authForms) authForms.style.display = 'none';
        
        // Ensure session storage is set
        sessionStorage.setItem('isLoggedIn', 'true');
    } else {
        // User is not logged in
        if (authLinks) authLinks.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (authRequiredElements) {
            authRequiredElements.forEach(element => {
                element.style.display = 'none';
            });
        }
        if (authForms) {
            authForms.style.display = 'flex';
            // Ensure login form is displayed and register form is hidden
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            if (loginForm) loginForm.style.display = 'block';
            if (registerForm) registerForm.style.display = 'none';
        }
        
        // Clear session storage
        sessionStorage.removeItem('isLoggedIn');
    }
}

function login123(email, password) {
    // Get user data from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Available users:', users);
    
    // Find user by email
    const user = users.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (user && user.password === hashPassword(password)) {
        // Login successful
        const currentUser = {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            phone: user.phone,
            address: user.address
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        sessionStorage.setItem('isLoggedIn', 'true');
        checkAuthentication123();
        alert('Login successful!');
    } else {
        // Login failed
        alert('Invalid email or password!');
    }
}

function register123(email, fullname, phone, address, password) {
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Current users:', users);

    // Check if email already exists
    if (users.some(user => user.email === email)) {
        alert('This email is already registered!');
        return;
    }

    // Create new user object with hashed password
    const newUser = {
        id: Date.now().toString(),
        email: email,
        fullname: fullname,
        phone: phone,
        address: address,
        password: hashPassword(password),
        resetToken: null,
        resetExpiry: null
    };

    // Add new user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Updated users:', users);

    // Auto login
    const currentUser = {
        id: newUser.id,
        email: newUser.email,
        fullname: newUser.fullname,
        phone: newUser.phone,
        address: newUser.address
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    sessionStorage.setItem('isLoggedIn', 'true');
    
    // Show success message
    alert('Registration successful! Logging you in automatically...');
    
    // Apply authentication UI updates
    checkAuthentication123();
    
    // Hide auth forms if they are displayed
    const authForms = document.getElementById('auth-forms');
    if (authForms) {
        authForms.style.display = 'none';
    }
    
    // Redirect to courses page after a short delay
    setTimeout(function() {
        // Redirect to home page or courses page
        window.location.href = 'courses.html';
    }, 1000);
}

function logout123() {
    // Clear user login status
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    
    // Redirect to logout page
    window.location.href = 'logout.html';
}

// Password match validation
function validatePasswordMatch123() {
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const confirmInput = document.getElementById('register-confirm-password');
    
    if (password !== confirmPassword) {
        confirmInput.setCustomValidity('Passwords do not match');
    } else {
        confirmInput.setCustomValidity('');
    }
}

// Password reset functionality
function initiatePasswordReset(email) {
    // Get user data from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
        alert('No user found with this email address!');
        return;
    }
    
    // Generate reset token and set expiry (24 hours from now)
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    const resetExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    // Update user with reset token
    users[userIndex].resetToken = resetToken;
    users[userIndex].resetExpiry = resetExpiry;
    localStorage.setItem('users', JSON.stringify(users));
    
    // In a real application, this would send an email
    // For this demo, we'll simulate by showing the reset token
    const resetUrl = `${window.location.origin}${window.location.pathname}?reset=${resetToken}`;
    
    alert(`Password reset link generated. In a real environment, this link would be sent to the user via email.\n\nReset Token: ${resetToken}\n\nPlease enter a new password:`);
    
    // Prompt for new password
    const newPassword = prompt('Please enter a new password:');
    if (newPassword) {
        completePasswordReset(resetToken, newPassword);
    }
}

function completePasswordReset(token, newPassword) {
    // Get user data from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.resetToken === token);
    
    if (userIndex === -1) {
        alert('Invalid reset token!');
        return;
    }
    
    // Check if token is expired
    if (new Date(users[userIndex].resetExpiry) < new Date()) {
        alert('Reset token has expired!');
        return;
    }
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
        alert(passwordValidation.message);
        return;
    }
    
    // Update password and clear reset token
    users[userIndex].password = hashPassword(newPassword);
    users[userIndex].resetToken = null;
    users[userIndex].resetExpiry = null;
    
    // Save updated users
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Password has been successfully reset! Please login with your new password.');
}

// Check URL for reset token when page loads
function checkForResetToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('reset');
    
    if (resetToken) {
        // Prompt for new password
        const newPassword = prompt('Please enter a new password:');
        if (newPassword) {
            completePasswordReset(resetToken, newPassword);
        }
    }
}

// Call this function when page loads
checkForResetToken(); 