const express = require('express');
const router = express.Router();

const { registerTenant, login, getCurrentUser, logout } = require('../controllers/auth.controller');
const { registerTenantValidator, loginValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');



// Tenant registration
router.post('/register-tenant', registerTenantValidator, validate, registerTenant);

// User login
router.post('/login', loginValidator, validate, login);

// Get current user
router.get('/me', authMiddleware, getCurrentUser);

// Logout
router.post('/logout', authMiddleware, logout);

module.exports = router;
