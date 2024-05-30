function loadForm() {
    document.getElementById('form-container').innerHTML = `
        <h2 class="title">Gaming Registration Form</h2>
        <form id="registration-form">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" class="input-field">
                <p id="username-error" class="error-message"></p>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" class="input-field">
                <p id="email-error" class="error-message"></p>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" class="input-field">
                <p id="password-error" class="error-message"></p>
            </div>
            <div class="form-group">
                <label for="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" class="input-field">
                <p id="confirm-password-error" class="error-message"></p>
            </div>
            <div class="button-group">
                <button id="submit-btn" class="submit-button" type="button">Register</button>
            </div>
        </form>
    `;
    attachFormValidation();
}

function attachFormValidation() {
    document.getElementById('submit-btn').addEventListener('click', function() {
        let isValid = true;
        
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        
        const usernameError = document.getElementById('username-error');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');
        const confirmPasswordError = document.getElementById('confirm-password-error');

        usernameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';

        usernameError.classList.remove('active');
        emailError.classList.remove('active');
        passwordError.classList.remove('active');
        confirmPasswordError.classList.remove('active');

        if (username.value.length < 3) {
            usernameError.textContent = 'Username must be at least 3 characters long.';
            usernameError.classList.add('active');
            isValid = false;
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailError.classList.add('active');
            isValid = false;
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password.value)) {
            passwordError.textContent = 'Password must be at least 8 characters long, include a number, an uppercase letter, and a lowercase letter.';
            passwordError.classList.add('active');
            isValid = false;
        }

        if (password.value !== confirmPassword.value) {
            confirmPasswordError.textContent = 'Passwords do not match.';
            confirmPasswordError.classList.add('active');
            isValid = false;
        }

        if (isValid) {
            location.hash = '#welcome';
        }
    });
}

function handleHashChange() {
    if (location.hash === '#welcome') {
        document.getElementById('form-container').innerHTML = `
            <div class="success-message">
                <h2 class="title">Registration Successful</h2>
                <h2 class="registered-data">Welcome, ${document.getElementById('username').value}!</h2>
                <h2 class="registered-data">Email : ${document.getElementById('email').value}</h2>
                <button id="back-btn" class="submit-button">Back to Form</button>
            </div>
        `;
        document.getElementById('back-btn').addEventListener('click', function() {
            location.hash = '';
        });
    } else {
        loadForm();
    }
}

window.addEventListener('hashchange', handleHashChange);

document.addEventListener('DOMContentLoaded', function() {
    loadForm();
});
