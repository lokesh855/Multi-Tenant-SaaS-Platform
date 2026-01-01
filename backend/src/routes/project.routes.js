const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");

const {
  createProject,
  listProjects,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

const {
  createTask,
  listProjectTasks,
  listTasksByAssignee,
} = require("../controllers/task.controller");

// Projects
router.post("/", auth, createProject);
router.get("/", auth, listProjects);
router.put("/:projectId", auth, updateProject);
router.delete("/:projectId", auth, deleteProject);

// Tasks
router.get("/tasks", auth, listTasksByAssignee);
router.post("/:projectId/tasks", auth, createTask);
router.get("/:projectId/tasks", auth, listProjectTasks);

module.exports = router;