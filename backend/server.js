require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./src/models");
const db = require("./src/models"); 
const runSeed = require("./src/utils/runseed");
const enableUuidExtension =require('./migrations/enable-uuid-extension')


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
  
    await enableUuidExtension(sequelize);
    
    await db.sequelize.sync({ alter: true }); // create tables if they don't exist
    console.log('Tables synced');

    await runSeed(db.sequelize);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
};

startServer();
