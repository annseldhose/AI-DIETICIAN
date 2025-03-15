document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    // Validate form
    const validationRules = {
        firstName: { required: true, minLength: 2, label: 'First name' },
        lastName: { required: true, minLength: 2, label: 'Last name' },
        dob: { required: true, label: 'Date of birth' },
        email: { required: true, email: true, label: 'Email' },
        password: { required: true, password: true, label: 'Password' }
    };

    const errors = validateForm(formData, validationRules);
    
    if (Object.keys(errors).length > 0) {
        showToast(Object.values(errors)[0], 'error');
        return;
    }

    try {
        showToast('Creating your account...', 'info');
        
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.success) {
            showToast('Account created successfully!', 'success');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        } else {
            showToast(data.message || 'Failed to create account', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showToast('Unable to connect to server', 'error');
    }
}); 