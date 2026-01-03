
const { body } = require('express-validator');

exports.registerTenantValidator = [
  body('tenantName').notEmpty(),
  body('subdomain').notEmpty(),
  body('adminEmail').isEmail(),
  body('adminPassword').isLength({ min: 8 }),
  body('adminFullName').notEmpty()
];


exports.loginValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('tenantSubdomain').notEmpty()
];
