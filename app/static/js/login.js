/**
 * Login Page JavaScript
 * Handles form submission, password toggle, and user authentication
 */

document.addEventListener('DOMContentLoaded', function() {
    initLoginForm();
    initPasswordToggle();
    initSocialButtons();
    initFormValidation();
});

/**
 * Initialize login form submission
 */
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
}

/**
 * Handle login form submission
 */
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-primary-full');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Clear previous errors
    clearErrors();
    
    // Show loading state
    setLoadingState(submitBtn, btnText, btnLoader, true);
    
    try {
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };
        
        // Validate form data
        if (!validateLoginData(data)) {
            return;
        }
        
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Show success message
            showSuccess('Успішний вхід! Перенаправлення...');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = result.redirect_url || '/';
            }, 300);
            
        } else {
            const error = await response.json();
            let errorMessage = 'Невірний email або пароль';
            
            if (error.detail) {
                errorMessage = error.detail;
            } else if (response.status === 401) {
                errorMessage = 'Невірні облікові дані';
            } else if (response.status === 429) {
                errorMessage = 'Забагато спроб входу. Спробуйте пізніше';
            } else if (response.status >= 500) {
                errorMessage = 'Помилка сервера. Спробуйте пізніше';
            }
            
            showError(errorMessage);
        }
        
    } catch (error) {
        console.error('Помилка входу:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Помилка підключення до сервера. Перевірте інтернет-з\'єднання');
        } else {
            showError('Невідома помилка. Спробуйте ще раз');
        }
    } finally {
        // Reset loading state
        setLoadingState(submitBtn, btnText, btnLoader, false);
    }
}

/**
 * Validate login form data
 */
function validateLoginData(data) {
    if (!data.email || !data.email.trim()) {
        showError('Введіть email адресу');
        focusField('email');
        return false;
    }
    
    if (!isValidEmail(data.email)) {
        showError('Введіть коректну email адресу');
        focusField('email');
        return false;
    }
    
    if (!data.password || data.password.length < 6) {
        showError('Пароль повинен містити мінімум 6 символів');
        focusField('password');
        return false;
    }
    
    return true;
}

/**
 * Initialize password toggle functionality
 */
function initPasswordToggle() {
    // Remove inline onclick and add proper event listeners
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const inputWrapper = this.parentElement;
            const passwordInput = inputWrapper.querySelector('input[type="password"], input[type="text"]');
            
            if (passwordInput) {
                togglePassword(passwordInput.id);
            }
        });
        
        // Add keyboard support
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Toggle password visibility
 */
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = passwordInput.parentElement.querySelector('.password-toggle');
    const eyeOpen = toggleButton.querySelector('.eye-open');
    const eyeClosed = toggleButton.querySelector('.eye-closed');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
        toggleButton.setAttribute('aria-label', 'Приховати пароль');
    } else {
        passwordInput.type = 'password';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
        toggleButton.setAttribute('aria-label', 'Показати пароль');
    }
}

/**
 * Initialize social login buttons
 */
function initSocialButtons() {
    const googleBtn = document.querySelector('.btn-social.google');
    const githubBtn = document.querySelector('.btn-social.github');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            handleSocialLogin('google');
        });
    }
    
    if (githubBtn) {
        githubBtn.addEventListener('click', function() {
            handleSocialLogin('github');
        });
    }
}

/**
 * Handle social login
 */
function handleSocialLogin(provider) {
    // Add loading state to social button
    const button = document.querySelector(`.btn-social.${provider}`);
    const originalContent = button.innerHTML;
    
    button.innerHTML = `
        <div class="spinner" style="width: 20px; height: 20px; margin-right: 8px;"></div>
        Підключення...
    `;
    button.disabled = true;
    
    // Redirect to social auth endpoint
    window.location.href = `/auth/social/${provider}`;
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmailField(this);
        });
        
        emailInput.addEventListener('input', function() {
            clearFieldError(this);
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            clearFieldError(this);
        });
    }
}

/**
 * Validate email field
 */
function validateEmailField(input) {
    const email = input.value.trim();
    
    if (email && !isValidEmail(email)) {
        showFieldError(input, 'Некоректний формат email');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

/**
 * Check if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show error message
 */
function showError(message) {
    clearErrors();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px; flex-shrink: 0;">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span>${message}</span>
    `;
    
    // Insert before submit button
    const submitBtn = document.querySelector('.btn-primary-full');
    submitBtn.parentNode.insertBefore(errorDiv, submitBtn);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    clearErrors();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px; flex-shrink: 0;">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span>${message}</span>
    `;
    
    const submitBtn = document.querySelector('.btn-primary-full');
    submitBtn.parentNode.insertBefore(successDiv, submitBtn);
}

/**
 * Show field-specific error
 */
function showFieldError(input, message) {
    clearFieldError(input);
    
    const inputWrapper = input.parentElement;
    inputWrapper.classList.add('error');
    
    const errorSpan = document.createElement('span');
    errorSpan.className = 'field-error';
    errorSpan.textContent = message;
    
    inputWrapper.parentElement.appendChild(errorSpan);
}

/**
 * Clear field-specific error
 */
function clearFieldError(input) {
    const inputWrapper = input.parentElement;
    inputWrapper.classList.remove('error');
    
    const fieldError = inputWrapper.parentElement.querySelector('.field-error');
    if (fieldError) {
        fieldError.remove();
    }
}

/**
 * Clear all error messages
 */
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message, .success-message');
    errorMessages.forEach(error => error.remove());
    
    const fieldErrors = document.querySelectorAll('.field-error');
    fieldErrors.forEach(error => error.remove());
    
    const errorInputs = document.querySelectorAll('.input-wrapper.error');
    errorInputs.forEach(wrapper => wrapper.classList.remove('error'));
}

/**
 * Set loading state for button
 */
function setLoadingState(button, textElement, loaderElement, isLoading) {
    if (isLoading) {
        textElement.style.display = 'none';
        loaderElement.style.display = 'flex';
        button.disabled = true;
        button.style.opacity = '0.7';
    } else {
        textElement.style.display = 'block';
        loaderElement.style.display = 'none';
        button.disabled = false;
        button.style.opacity = '1';
    }
}

/**
 * Focus on specific field
 */
function focusField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.focus();
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Add enhanced keyboard navigation
 */
document.addEventListener('keydown', function(e) {
    // Enter key in email field focuses password
    if (e.key === 'Enter' && e.target.id === 'email') {
        e.preventDefault();
        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.focus();
        }
    }
});

/**
 * Add auto-focus to first empty field
 */
window.addEventListener('load', function() {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    if (emailField && !emailField.value.trim()) {
        emailField.focus();
    } else if (passwordField && !passwordField.value.trim()) {
        passwordField.focus();
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        validateLoginData,
        togglePassword
    };
}