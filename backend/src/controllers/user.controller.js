// controllers/user.controller.js
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const  {User , Tenant, AuditLog }  = require("../models");


exports.addUserToTenant = async (req, res, next) => {
  const { tenantId } = req.params;
  const { email, password, fullName, role = "user" } = req.body;

  try {
    console.log("Requesting user:", req.body); 
    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant not found" });
    }

    const userCount = await User.count({ where: { tenantId } });
    if (userCount >= tenant.maxUsers) {
      return res
        .status(403)
        .json({ success: false, message: "Subscription user limit reached" });
    }

    const existingUser = await User.findOne({
      where: { email, tenantId },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists in tenant" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      passwordHash,
      fullName,
      role,
      tenantId,
      isActive: true,
    });

    await AuditLog.create({
      tenantId,
      userId: req.user.userId,
      action: "CREATE_USER",
      entityType: "user",
      entityId: newUser.id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        tenantId: newUser.tenantId,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};
//---------------------------------------------------------------


exports.listTenantUsers = async (req, res, next) => {
  const { tenantId } = req.params;
  const {
    search,
    role,
    page = 1,
    limit = 50,
  } = req.query;

  try {
    if (req.user.role !== "super_admin" && req.user.tenantId !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const pageNumber = Math.max(parseInt(page, 10), 1);
    const pageLimit = Math.min(parseInt(limit, 10) || 50, 100);
    const offset = (pageNumber - 1) * pageLimit;

    const where = {
      tenantId,
    };

    if (role) {
      where.role = role;
    }

    if (search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${search}%` } },
        { fullName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: [
        "id",
        "email",
        "fullName",
        "role",
        "isActive",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
      limit: pageLimit,
      offset,
    });

    res.status(200).json({
      success: true,
      data: {
        users: rows,
        total: count,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(count / pageLimit),
          limit: pageLimit,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

//------------------------------------------------------------


exports.updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { fullName, role, isActive } = req.body;

  try {
    const targetUser = await User.findByPk(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Tenant isolation
    if (
      req.user.role !== "super_admin" &&
      req.user.tenantId !== targetUser.tenantId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const isSelf = req.user.id === targetUser.id;
    const isTenantAdmin = req.user.role === "tenant_admin";

    // Self update: only fullName
    if (isSelf && !isTenantAdmin) {
      if (role !== undefined || isActive !== undefined) {
        return res.status(403).json({
          success: false,
          message: "Not allowed to update role or status",
        });
      }
    }

    // Tenant admin permissions
    if (!isTenantAdmin && !isSelf) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    if (fullName !== undefined) targetUser.fullName = fullName;
    if (isTenantAdmin && role !== undefined) targetUser.role = role;
    if (isTenantAdmin && isActive !== undefined)
      targetUser.isActive = isActive;

    await targetUser.save();

    // Audit log
    await AuditLog.create({
      tenantId: targetUser.tenantId,
      userId: req.user.id,
      action: "UPDATE_USER",
      entityType: "user",
      entityId: targetUser.id,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id: targetUser.id,
        fullName: targetUser.fullName,
        role: targetUser.role,
        updatedAt: targetUser.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

//-----------------------------------------------------


exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    // Only tenant_admin allowed
    if (req.user.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Prevent self-delete
    if (req.user.id === userId) {
      return res.status(403).json({
        success: false,
        message: "Tenant admin cannot delete themselves",
      });
    }

    const targetUser = await User.findByPk(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Tenant isolation
    if (targetUser.tenantId !== req.user.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await targetUser.destroy(); // CASCADE / SET NULL handled by DB constraints

    // Audit log
    await AuditLog.create({
      tenantId: req.user.tenantId,
      userId: req.user.id,
      action: "DELETE_USER",
      entityType: "user",
      entityId: userId,
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
