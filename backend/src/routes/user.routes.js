// routes/user.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const { updateUser } = require("../controllers/user.controller");
const { deleteUser } = require("../controllers/user.controller");


router.put(
  "/:userId",
  auth,
  updateUser
);

//-------------------------------------------------------------

router.delete("/:userId", auth, deleteUser);

module.exports = router;
