const  {User , Project , AuditLog , Task}  = require("../models");
const { Op } = require("sequelize");


exports.listTasksByAssignee = async (req, res, next) => {
  try {
    const { assignedTo } = req.query;
    const { tenantId } = req.user;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "assignedTo query parameter is required",
      });
    }

    const tasks = await Task.findAll({
      where: {
        assignedTo,
        tenantId,
      },
      include: [
        {
          model: Project,
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "fullName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        project: task.Project
          ? {
              id: task.Project.id,
              name: task.Project.name,
            }
          : null,
        assignedTo: task.assignee
          ? {
              id: task.assignee.id,
              fullName: task.assignee.fullName,
              email: task.assignee.email,
            }
          : null,
        createdAt: task.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

//---------------------------------------------------------------

exports.createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const { userId } = req.user;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Project does not belong to your tenant",
      });
    }

    if (assignedTo) {
      const assignedUser = await User.findOne({
        where: {
          id: assignedTo,
          tenantId: project.tenantId,
        },
      });

      if (!assignedUser) {
        return res.status(400).json({
          success: false,
          message: "Assigned user does not belong to the same tenant",
        });
      }
    }

    const task = await Task.create({
      projectId,
      tenantId: project.tenantId,
      title,
      description,
      status: "todo",
      priority: priority || "medium",
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
    });

    await AuditLog.create({
      tenantId: project.tenantId,
      userId,
      action: "CREATE_TASK",
      entityType: "task",
      entityId: task.id,
    });

    res.status(201).json({
      success: true,
      data: {
        id: task.id,
        projectId: task.projectId,
        tenantId: task.tenantId,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------------------------


exports.listProjectTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const {
      status,
      assignedTo,
      priority,
      search,
      page = 1,
      limit = 50,
    } = req.query;

    const offset = (page - 1) * limit;

    const project = await Project.findOne({
      where: {
        id: projectId,
        tenantId: req.user.tenantId,
      },
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Project does not belong to your tenant",
      });
    }

    const whereClause = {
      projectId,
      tenantId: req.user.tenantId,
    };

    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (assignedTo) whereClause.assignedTo = assignedTo;
    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const { rows, count } = await Task.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "fullName", "email"],
        },
      ],
      order: [
        ["priority", "DESC"],
        ["dueDate", "ASC"],
      ],
      limit: Math.min(parseInt(limit), 100),
      offset,
    });

    res.status(200).json({
      success: true,
      data: {
        tasks: rows.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignee
            ? {
                id: task.assignee.id,
                fullName: task.assignee.fullName,
                email: task.assignee.email,
              }
            : null,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
        })),
        total: count,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


//-------------------------------------------------------------------------


exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const { tenantId, userId } = req.user;

    const task = await Task.findOne({
      where: {
        id: taskId,
        tenantId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or does not belong to your tenant",
      });
    }

    task.status = status;
    await task.save();

    await AuditLog.create({
      tenantId,
      userId,
      action: "UPDATE_TASK_STATUS",
      entityType: "task",
      entityId: task.id,
    });

    res.status(200).json({
      success: true,
      data: {
        id: task.id,
        status: task.status,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};


//----------------------------------------------------------------


exports.updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
    } = req.body;

    const { tenantId, userId } = req.user;

    const task = await Task.findOne({
      where: {
        id: taskId,
        tenantId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or does not belong to your tenant",
      });
    }

    if (assignedTo !== undefined) {
      if (assignedTo !== null) {
        const user = await User.findOne({
          where: {
            id: assignedTo,
            tenantId,
          },
        });

        if (!user) {
          return res.status(400).json({
            success: false,
            message: "Assigned user does not belong to the same tenant",
          });
        }
      }
      task.assignedTo = assignedTo;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    const assignedUser = task.assignedTo
      ? await User.findByPk(task.assignedTo, {
          attributes: ["id", "fullName", "email"],
        })
      : null;

    await AuditLog.create({
      tenantId,
      userId,
      action: "UPDATE_TASK",
      entityType: "task",
      entityId: task.id,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: assignedUser,
        dueDate: task.dueDate,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
