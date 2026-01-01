const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'Project',
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

      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'created_by'
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT
      },

      status: {
        type: DataTypes.ENUM('active', 'archived', 'completed'),
        allowNull: false,
        defaultValue: 'active'
      }
    },
    {
      tableName: 'projects',
      underscored: true,
      timestamps: true,
      freezeTableName: true,
      indexes: [
        { fields: ['tenant_id'] }
      ]
    }
  );

  Project.associate = models => {
    Project.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Project.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    Project.hasMany(models.Task, { foreignKey: 'project_id' });
  };

  return Project;
};
