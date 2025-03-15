// Check authentication
if (!localStorage.getItem('token')) {
    window.location.href = '/';
}

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        weight: document.getElementById('weight').value,
        height: document.getElementById('height').value,
        dietType: document.getElementById('dietType').value,
        disease: document.getElementById('disease').value,
        about: document.getElementById('about').value
    };

    try {
        showToast('Updating profile...', 'info');
        const response = await fetch('/api/user/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.success) {
            showToast('Profile updated successfully!');
        } else {
            showToast(data.message || 'Update failed', 'error');
        }
    } catch (error) {
        console.error('Update error:', error);
        showToast('Failed to update profile', 'error');
    }
});

// Function to refresh diet plan
async function refreshDietPlan() {
    try {
        showToast('Generating new diet plan...', 'info');
        const response = await fetch('/api/user/generate-diet-plan', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        if (data.success) {
            displayDietPlan(data.dietPlan);
            showToast('Diet plan updated successfully!');
        } else {
            showToast('Failed to update diet plan', 'error');
        }
    } catch (error) {
        console.error('Diet plan refresh error:', error);
        showToast('Failed to refresh diet plan', 'error');
    }
}

function displayDietPlan(plan) {
    const dietPlanContainer = document.getElementById('dietPlan');
    dietPlanContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${Object.entries(plan).map(([meal, details]) => `
                <div class="bg-gray-50 p-6 rounded-xl">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                        ${meal}
                    </h3>
                    <ul class="space-y-3">
                        ${details.split(',').map(item => `
                            <li class="flex items-center text-gray-600">
                                <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    `;
}


// Fetch user profile on page load
async function fetchProfile() {
    try {
        const response = await fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        if (data.success) {
            const profile = data.data.healthProfile;
            // Update form fields
            Object.keys(profile).forEach(key => {
                const input = document.getElementById(key);
                if (input) input.value = profile[key] || '';
            });
            
            // Display diet plan if available
            if (data.data.dietPlan) {
                displayDietPlan(data.data.dietPlan);
            }
        }
    } catch (error) {
        console.error('Fetch profile error:', error);
        showToast('Failed to load profile', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

// Initialize
fetchProfile();

// Password toggle function
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
} 