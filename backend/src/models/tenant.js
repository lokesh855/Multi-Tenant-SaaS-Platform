const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

module.exports = (sequelize, DataTypes) => {
  const Tenant = sequelize.define(
    'Tenant',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subdomain: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      status: {
        type: DataTypes.ENUM('active', 'suspended', 'trial'),
        defaultValue: 'trial'
      },

      subscriptionPlan: {
        type: DataTypes.ENUM('free', 'pro', 'enterprise'),
        defaultValue: 'free',
        field: 'subscription_plan'
      },

      maxUsers: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        field: 'max_users'
      },

      maxProjects: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        field: 'max_projects'
      }

    },
    {
      tableName: 'tenants',
      underscored: true,
      timestamps: true,
      freezeTableName: true
    }
  );

  Tenant.associate = models => {
    Tenant.hasMany(models.User, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.Project, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.Task, { foreignKey: 'tenant_id' });
    Tenant.hasMany(models.AuditLog, { foreignKey: 'tenant_id' });
  };

  return Tenant;
};
