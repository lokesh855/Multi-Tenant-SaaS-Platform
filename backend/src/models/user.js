const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      tenantId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'tenant_id'
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false
      },

      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password_hash'
      },

      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'full_name'
      },

      role: {
        type: DataTypes.ENUM('super_admin', 'tenant_admin', 'user'),
        allowNull: false
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        field: 'is_active',
        defaultValue: true
      }
    },
    {
      tableName: 'users',
      underscored: true,
      timestamps: true,
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ['tenant_id', 'email']
        }
      ]
    }
  );

  User.associate = models => {
    User.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    User.hasMany(models.Project, { foreignKey: 'created_by' });
    User.hasMany(models.Task, { foreignKey: 'assigned_to' });
    User.hasMany(models.AuditLog, { foreignKey: 'user_id' });
  };

  return User;
};


