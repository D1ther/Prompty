/**
 * Registration Page JavaScript
 * Handles form submission, password validation, and user registration
 */

document.addEventListener('DOMContentLoaded', function() {
    initRegisterForm();
    initPasswordToggle();
    initPasswordStrength();
    initSocialButtons();
    initFormValidation();
});

/**
 * Initialize registration form submission
 */
function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
}

/**
 * Handle registration form submission
 */
async function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-primary-full');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Clear previous errors
    clearErrors();
    
    try {
        const formData = new FormData(form);
        const data = {
            username: formData.get('firstName'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            terms: formData.get('terms') === 'on'
        };
        
        // Validate form data
        if (!validateRegisterData(data)) {
            return;
        }
        
        // Show loading state
        setLoadingState(submitBtn, btnText, btnLoader, true);
        
        const response = await fetch('/users/register_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password
            })
        });
        
        if (response.ok) {
            // Show success message
            showSuccess('Реєстрація успішна! Перенаправлення...');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
            
        } else {
            const error = await response.json();
            let errorMessage = 'Помилка реєстрації';
            
            if (error.detail) {
                errorMessage = error.detail;
            } else if (response.status === 409) {
                errorMessage = 'Користувач з таким email вже існує';
            } else if (response.status === 422) {
                errorMessage = 'Некоректні дані. Перевірте введену інформацію';
            } else if (response.status >= 500) {
                errorMessage = 'Помилка сервера. Спробуйте пізніше';
            }
            
            showError(errorMessage);
        }
        
    } catch (error) {
        console.error('Помилка реєстрації:', error);
        
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
 * Validate registration form data
 */
function validateRegisterData(data) {
    // Check first name
    if (!data.username || !data.username.trim()) {
        showError('Введіть ваше ім\'я');
        focusField('firstName');
        return false;
    }
    
    if (data.username.trim().length < 2) {
        showError('Ім\'я повинно містити мінімум 2 символи');
        focusField('firstName');
        return false;
    }
    
    // Check email
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
    
    // Check password
    if (!data.password || data.password.length < 8) {
        showError('Пароль повинен містити мінімум 8 символів');
        focusField('password');
        return false;
    }
    
    // Check password strength
    if (checkPasswordStrength(data.password) < 3) {
        showError('Пароль занадто слабкий. Використовуйте принаймні 8 символів з літерами, цифрами та спеціальними символами.');
        focusField('password');
        return false;
    }
    
    // Check password confirmation
    if (data.password !== data.confirmPassword) {
        showError('Паролі не співпадають!');
        focusField('confirmPassword');
        return false;
    }
    
    // Check terms agreement
    if (!data.terms) {
        showError('Ви повинні погодитись з умовами використання');
        focusField('terms');
        return false;
    }
    
    return true;
}

/**
 * Initialize password toggle functionality
 */
function initPasswordToggle() {
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
 * Initialize password strength checking
 */
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function(e) {
            checkPasswordStrength(e.target.value);
        });
    }
}

/**
 * Check password strength and update UI
 */
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = '';
    
    // Check different criteria
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return strength;
    
    // Update strength indicator
    switch (strength) {
        case 0:
        case 1:
            strengthFill.style.width = '20%';
            strengthFill.style.backgroundColor = '#ff4757';
            feedback = 'Дуже слабкий';
            break;
        case 2:
            strengthFill.style.width = '40%';
            strengthFill.style.backgroundColor = '#ff6b6b';
            feedback = 'Слабкий';
            break;
        case 3:
            strengthFill.style.width = '60%';
            strengthFill.style.backgroundColor = '#ffa502';
            feedback = 'Середній';
            break;
        case 4:
            strengthFill.style.width = '80%';
            strengthFill.style.backgroundColor = '#2ed573';
            feedback = 'Сильний';
            break;
        case 5:
            strengthFill.style.width = '100%';
            strengthFill.style.backgroundColor = '#2ed573';
            feedback = 'Дуже сильний';
            break;
        default:
            strengthFill.style.width = '0%';
            feedback = 'Введіть пароль';
    }
    
    strengthText.textContent = feedback;
    return strength;
}

/**
 * Initialize social registration buttons
 */
function initSocialButtons() {
    const googleBtn = document.querySelector('.btn-social.google');
    const githubBtn = document.querySelector('.btn-social.github');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            handleSocialRegister('google');
        });
    }
    
    if (githubBtn) {
        githubBtn.addEventListener('click', function() {
            handleSocialRegister('github');
        });
    }
}

/**
 * Handle social registration
 */
function handleSocialRegister(provider) {
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
    const firstNameInput = document.getElementById('firstName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // First name validation
    if (firstNameInput) {
        firstNameInput.addEventListener('blur', function() {
            validateNameField(this);
        });
        
        firstNameInput.addEventListener('input', function() {
            clearFieldError(this);
        });
    }
    
    // Email validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmailField(this);
        });
        
        emailInput.addEventListener('input', function() {
            clearFieldError(this);
        });
    }
    
    // Password confirmation validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            validatePasswordConfirmation();
        });
        
        confirmPasswordInput.addEventListener('input', function() {
            clearFieldError(this);
        });
    }
    
    // Real-time password validation
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            clearFieldError(this);
            if (confirmPasswordInput.value) {
                validatePasswordConfirmation();
            }
        });
    }
}

/**
 * Validate name field
 */
function validateNameField(input) {
    const name = input.value.trim();
    
    if (name.length > 0 && name.length < 2) {
        showFieldError(input, 'Ім\'я повинно містити мінімум 2 символи');
        return false;
    }
    
    clearFieldError(input);
    return true;
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
 * Validate password confirmation
 */
function validatePasswordConfirmation() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError(document.getElementById('confirmPassword'), 'Паролі не співпадають');
        return false;
    }
    
    clearFieldError(document.getElementById('confirmPassword'));
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
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        
        // Navigate through form fields on Enter
        if (activeElement.id === 'firstName') {
            e.preventDefault();
            document.getElementById('email').focus();
        } else if (activeElement.id === 'email') {
            e.preventDefault();
            document.getElementById('password').focus();
        } else if (activeElement.id === 'password') {
            e.preventDefault();
            document.getElementById('confirmPassword').focus();
        }
    }
});

/**
 * Add auto-focus to first empty field
 */
window.addEventListener('load', function() {
    const firstNameField = document.getElementById('firstName');
    if (firstNameField && !firstNameField.value.trim()) {
        firstNameField.focus();
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        validateRegisterData,
        checkPasswordStrength,
        togglePassword
    };
}