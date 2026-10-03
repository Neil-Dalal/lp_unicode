const express = require('express');
const router = express.Router();
const { register, login, generateNewAccessToken } = require('../controllers/logic');
const verifyToken = require('../middleware/auth'); 
router.post('/checkauth/register', register);
router.post('/checkauth/login', login);
router.post('/refresh', generateNewAccessToken);

router.get('/dashboard', verifyToken, (req, res) => {
    res.status(200).json({ 
        message: "Welcome to the secure dashboard!",
        yourUserId: req.user.userId 
    });
});

module.exports = router;