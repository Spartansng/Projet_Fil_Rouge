const express = require('express');
const router = express.Router();

const { register, login, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { registerValidator, loginValidator } = require('../middleware/validators/authValidators');

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/me', authMiddleware, me);

module.exports = router;