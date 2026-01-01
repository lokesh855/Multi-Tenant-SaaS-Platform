const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
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

      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'project_id'
      },

      assignedTo: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'assigned_to'
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false
      },

      description: DataTypes.TEXT,

      status: {
        type: DataTypes.ENUM('todo', 'in_progress', 'completed'),
        allowNull: false,
        defaultValue: 'todo'
      },

      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'medium'
      },

      dueDate: {
        type: DataTypes.DATEONLY,
        field: 'due_date'
      }
    },
    {
      tableName: 'tasks',
      underscored: true,
      timestamps: true,
      freezeTableName: true,
      indexes: [
        { fields: ['tenant_id', 'project_id'] }
      ]
    }
  );

  Task.associate = models => {
    Task.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    Task.belongsTo(models.Project, { foreignKey: 'project_id' });
    Task.belongsTo(models.User, {
      foreignKey: 'assigned_to',
      as: 'assignee'
    });
  };

  return Task;
};
