const jwt = require("jsonwebtoken");
const User = require("../database/User");

// Middleware: Authenticate JWT and attach user to request
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user without password
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // attach user object to request
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware: Restrict access to a certain role
// RENAMED from authorizeRoles to authorizeRole to fix the error
const authorizeRole = (role) => {
  return (req, res, next) => {
    // Check if the user's role matches the required role
    if (req.user && req.user.role === role) {
      next();
    } else {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
  };
};

module.exports = { authenticateJWT, authorizeRole };

