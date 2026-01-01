const fs = require("fs");
const path = require("path");

module.exports = async function runSeed(sequelize) {
    try {
        const seedPath = path.join(__dirname, "../../seeders/seed_data.sql");

        if (!fs.existsSync(seedPath)) {
            console.log("⚠️ Seed file not found, skipping...");
            return;
        }

        const [result] = await sequelize.query(
            'SELECT COUNT(*) FROM "users";'
        );

        if (parseInt(result[0].count) > 0) {
            console.log("⚠️ Seed already applied. Skipping...");
            return;
        }

        const seedSQL = fs.readFileSync(seedPath, "utf8");

        await sequelize.query(seedSQL);
        console.log("✅ Seed file executed successfully");
    } catch (error) {
        console.error("❌ Error executing seed file:", error);
    }
};
