const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  {User , Tenant}  = require("../models");
const { logAction } = require("../services/audit.services");

// ================= REGISTER TENANT =================
exports.registerTenant = async (req, res, next) => {
  try {
    const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;

    const existingTenant = await Tenant.findOne({ where: { subdomain } });
    if (existingTenant) {
      return res.status(409).json({ message: "Subdomain already exists" });
    }

    const existingUser = await User.findOne({ where: { email: adminEmail } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const tenant = await Tenant.create({
      name: tenantName,
      subdomain,
      status: "active",
      subscriptionPlan: "pro",
    });

    const adminUser = await User.create({
      tenantId: tenant.id,
      email: adminEmail,
      passwordHash: hashedPassword,
      fullName: adminFullName,
      role: "tenant_admin",
    });

    res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
      data: {
        tenantId: tenant.id,
        subdomain,
        adminUser: {
          id: adminUser.id,
          email: adminUser.email,
          fullName: adminUser.fullName,
          role: adminUser.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================= LOGIN =================

exports.login = async (req, res, next) => {
  try {
    const { email, password, tenantSubdomain } = req.body;

    // 1️⃣ First find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User inactive" });
    }

    // 2️⃣ SUPER ADMIN LOGIN (no tenant check)
    if (user.role === "super_admin") {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: "PasswordInvalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
          },
          token,
          expiresIn: 86400,
        },
      });
    }

    // 3️⃣ TENANT ADMIN / USER LOGIN (tenant required)
    if (!tenantSubdomain) {
      return res
        .status(400)
        .json({ message: "Tenant subdomain is required" });
    }

    const tenant = await Tenant.findOne({
      where: { subdomain: tenantSubdomain },
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    if (tenant.status !== "active") {
      return res.status(403).json({ message: "Tenant inactive" });
    }

    // Ensure user belongs to tenant
    if (user.tenantId !== tenant.id) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: tenant.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          tenantId: tenant.id,
        },
        token,
        expiresIn: 86400,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ================= CURRENT USER =================
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: { model: Tenant },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        tenant: user.Tenant,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================= LOGOUT =================
exports.logout = async (req, res, next) => {
  try {
    await logAction({
      tenantId: req.user.tenantId,
      userId: req.user.id,
      action: "LOGOUT",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
