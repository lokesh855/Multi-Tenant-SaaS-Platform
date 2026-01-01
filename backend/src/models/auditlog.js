const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    'AuditLog',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      tenantId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'tenant_id'
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'user_id'
      },

      action: {
        type: DataTypes.STRING,
        allowNull: false
      },

      entityType: {
        type: DataTypes.STRING,
        field: 'entity_type'
      },

      entityId: {
        type: DataTypes.STRING,
        field: 'entity_id'
      },

      ipAddress: {
        type: DataTypes.STRING,
        field: 'ip_address'
      }
    },
    {
      tableName: 'audit_logs',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      freezeTableName: true
    }
  );

  AuditLog.associate = models => {
    AuditLog.belongsTo(models.Tenant, {
      foreignKey: 'tenant_id'
    });

    AuditLog.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };

  return AuditLog;
};
