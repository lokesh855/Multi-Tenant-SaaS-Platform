const  {User , Tenant, Project, AuditLog, Task }  = require("../models");
const { Op, fn, col, literal } = require("sequelize");


exports.createProject = async (req, res, next) => {
  const { name, description, status } = req.body;

  try {
    const { tenantId, id: userId } = req.user;

    // Fetch tenant to check limits
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    // Check project limit
    const projectCount = await Project.count({ where: { tenantId } });
    if (projectCount >= tenant.maxProjects) {
      return res.status(403).json({
        success: false,
        message: "Project limit reached",
      });
    }

    const project = await Project.create({
      tenantId,
      name,
      description,
      status: status || "active",
      createdBy: userId,
    });

    // Audit log
    await AuditLog.create({
      tenantId,
      userId,
      action: "CREATE_PROJECT",
      entityType: "project",
      entityId: project.id,
    });

    res.status(201).json({
      success: true,
      data: {
        id: project.id,
        tenantId: project.tenantId,
        name: project.name,
        description: project.description,
        status: project.status,
        createdBy: project.createdBy,
        createdAt: project.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};


//----------------------------------------------------------------------

exports.listProjects = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const {
      status,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    const where = { tenantId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const { rows, count } = await Project.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["fullName"],
        },
      ],
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM tasks t
              WHERE t.project_id = "Project".id
            )`),
            "taskCount",
          ],
          [
            literal(`(
              SELECT COUNT(*)
              FROM tasks t
              WHERE t.project_id = "Project".id
              AND t.status = 'completed'
            )`),
            "completedTaskCount",
          ],
        ],
      },
      order: [["createdAt", "DESC"]],
      limit: limitNum,
      offset,
    });

    res.status(200).json({
      success: true,
      data: {
        projects: rows.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          status: p.status,
          createdBy: p.creator?.fullName || null,
          taskCount: Number(p.get("taskCount")),
          completedTaskCount: Number(p.get("completedTaskCount")),
          createdAt: p.createdAt,
        })),
        total: count,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(count / limitNum),
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


//---------------------------------------------------------------


exports.updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name, description, status } = req.body;
    const { userId, tenantId, role } = req.user;

    const project = await Project.findOne({
      where: { id: projectId, tenantId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isTenantAdmin = role === "tenant_admin";
    const isCreator = project.createdBy === userId;

    if (!isTenantAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this project",
      });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;

    await project.save();

    await AuditLog.create({
      tenantId,
      userId,
      action: "UPDATE_PROJECT",
      entityType: "project",
      entityId: project.id,
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};


//---------------------------------------------------------------------



exports.deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { userId, tenantId, role } = req.user;

    const project = await Project.findOne({
      where: { id: projectId, tenantId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isTenantAdmin = role === "tenant_admin";
    const isCreator = project.createdBy === userId;

    if (!isTenantAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this project",
      });
    }

    await project.destroy(); // tasks deleted via CASCADE

    await AuditLog.create({
      tenantId,
      userId,
      action: "DELETE_PROJECT",
      entityType: "project",
      entityId: projectId,
    });

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
