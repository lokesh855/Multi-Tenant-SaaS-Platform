const auditLog = require("../services/audit.services");
const { Op, literal } = require("sequelize");
const { User, Tenant, Project, Task } = require("../models");

/**
 * GET TENANT DETAILS WITH STATS
 */
exports.getTenantDetails = async (req, res, next) => {
  try {
    const { tenantId: paramTenantId } = req.params;
    const { tenantId, role } = req.user;

    // Authorization
    if (role !== "super_admin" && tenantId !== paramTenantId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Fetch tenant
    const tenant = await Tenant.findByPk(paramTenantId);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    // Stats
    const [totalUsers, totalProjects, totalTasks] = await Promise.all([
      User.count({ where: { tenantId: paramTenantId } }),
      Project.count({ where: { tenantId: paramTenantId } }),
      Task.count({ where: { tenantId: paramTenantId } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        status: tenant.status,
        subscriptionPlan: tenant.subscriptionPlan,
        maxUsers: tenant.maxUsers,
        maxProjects: tenant.maxProjects,
        createdAt: tenant.createdAt,
        stats: {
          totalUsers,
          totalProjects,
          totalTasks,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE TENANT
 */
exports.updateTenant = async (req, res, next) => {
  try {
    const { tenantId } = req.params;
    const { role, tenantId: tokenTenantId, userId } = req.user;

    // Authorization
    if (role === "tenant_admin" && tenantId !== tokenTenantId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    // Fields tenant_admin can update
    const allowedForTenantAdmin = ["name"];
    const updates = {};

    for (const key in req.body) {
      if (role === "tenant_admin" && !allowedForTenantAdmin.includes(key)) {
        return res.status(403).json({
          success: false,
          message: `Not allowed to update field: ${key}`,
        });
      }
      updates[key] = req.body[key];
    }

    await tenant.update(updates);

    // Audit log
    await auditLog({
      userId,
      tenantId,
      action: "UPDATE_TENANT",
      details: updates,
    });

    res.status(200).json({
      success: true,
      message: "Tenant updated successfully",
      data: {
        id: tenant.id,
        name: tenant.name,
        updatedAt: tenant.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * LIST TENANTS (SUPER ADMIN)
 */
exports.listTenants = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.subscriptionPlan)
      where.subscriptionPlan = req.query.subscriptionPlan;

    const { count, rows } = await Tenant.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      distinct: true,
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM users u
              WHERE u.tenant_id = "Tenant"."id"
            )`),
            "totalUsers",
          ],
          [
            literal(`(
              SELECT COUNT(*)
              FROM projects p
              WHERE p.tenant_id = "Tenant"."id"
            )`),
            "totalProjects",
          ],
        ],
      },
    });

    res.status(200).json({
      success: true,
      data: {
        tenants: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalTenants: count,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("List tenants error:", error);
    next(error);
  }
};