const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.post('/update-profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        user.healthProfile = req.body;
        await user.save();
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/generate-diet-plan', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        const { weight, height, age, gender, active } = user.healthProfile;
        
        const pythonProcess = spawn('python', ['generate_diet_plan.py', weight, height, age, gender, activityLevel]);
        
        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();  // Capture the script's output
        });
        
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });
        
        pythonProcess.on('close', async (code) => {
            if (code === 0) {
                try {
                    const dietPlan = JSON.parse(result);  // Parse the Python script output into JSON
                    user.dietPlan = dietPlan;
                    await user.save();
                    res.json({ success: true, dietPlan });
                } catch (error) {
                    res.status(500).json({ success: false, message: 'Error parsing diet plan' });
                }
            } else {
                res.status(500).json({ success: false, message: 'Error generating diet plan' });
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
module.exports=router;
