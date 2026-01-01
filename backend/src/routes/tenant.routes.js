const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { addUserToTenant } = require("../controllers/user.controller");
const { getTenantDetails } = require('../controllers/tenant.controller');
const { updateTenant } = require("../controllers/tenant.controller");
const authorizeRoles = require("../middlewares/role.middleware");
const { listTenants } = require("../controllers/tenant.controller");
const { listTenantUsers } = require("../controllers/user.controller");


router.get('/:tenantId', auth, getTenantDetails);

router.post(
  "/:tenantId/users",
  auth,
  authorizeRoles(["tenant_admin"]),
  addUserToTenant
);


router.get(
  "/:tenantId/users",
  auth,
  listTenantUsers
);
//------------------------------------------------

router.put(
  "/:tenantId",
  auth,
  authorizeRoles(["tenant_admin", "super_admin"]),
  updateTenant
);


//-------------------------------------------------------------------------


router.get(
  "/",
  auth,
  authorizeRoles(["super_admin"]),
  listTenants
);

module.exports = router;
