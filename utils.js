// Enhanced toast notification system
function showToast(message, type = 'success') {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        className: `toast-${type}`,
        style: {
            background: type === 'success' ? "#22c55e" : // green-500
                       type === 'error' ? "#ef4444" :    // red-500
                       type === 'warning' ? "#f97316" :  // orange-500
                       "#3b82f6",                        // blue-500 (info)
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            fontSize: "14px",
            fontWeight: "500"
        },
        onClick: function(){} // Callback after click
    }).showToast();
}

// Form validation helper
function validateForm(formData, rules) {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
        const value = formData[field];
        const fieldRules = rules[field];

        if (fieldRules.required && !value) {
            errors[field] = `${fieldRules.label} is required`;
        }

        if (fieldRules.minLength && value.length < fieldRules.minLength) {
            errors[field] = `${fieldRules.label} must be at least ${fieldRules.minLength} characters`;
        }

        if (fieldRules.email && !validateEmail(value)) {
            errors[field] = `Please enter a valid email address`;
        }

        if (fieldRules.password && !validatePassword(value)) {
            errors[field] = `Password must contain at least 8 characters, including uppercase, lowercase, number`;
        }
    });

    return errors;
}

// Email validation
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Password validation
function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
} 