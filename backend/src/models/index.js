const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  }
);

const db = {};

// 👇 Explicit order (IMPORTANT)
db.Tenant = require('./tenant')(sequelize, DataTypes);
db.User = require('./user')(sequelize, DataTypes);
db.Project = require('./project')(sequelize, DataTypes);
db.Task = require('./task')(sequelize, DataTypes);
db.AuditLog = require('./auditlog')(sequelize, DataTypes);

// Associations
Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
