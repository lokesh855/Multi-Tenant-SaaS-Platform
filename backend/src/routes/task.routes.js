// routes/task.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const { updateTask } = require("../controllers/task.controller");
const { updateTaskStatus } = require("../controllers/task.controller");

router.patch("/:taskId/status", auth, updateTaskStatus);

router.put("/:taskId", auth, updateTask);

module.exports = router;
