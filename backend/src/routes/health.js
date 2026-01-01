const router = require("express").Router();
const sequelize = require("../config/db");

router.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();

    return res.status(200).json({
      status: "ok",
      database: "connected"
    });
  } catch (err) {
    return res.status(503).json({
      status: "error",
      database: "disconnected"
    });
  }
});

module.exports = router;
