document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    // Validate form
    const validationRules = {
        email: { required: true, email: true, label: 'Email' },
        password: { required: true, label: 'Password' }
    };

    const errors = validateForm(formData, validationRules);
    
    if (Object.keys(errors).length > 0) {
        // Show first error message
        showToast(Object.values(errors)[0], 'error');
        return;
    }

    try {
        showToast('Logging in...', 'info');
        
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } else {
            showToast(data.message || 'Invalid credentials', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Unable to connect to server', 'error');
    }
}); 