import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization token missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];

    const { id } = JWT.verify(token, process.env.JWT_SECRET);
    req.user = id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in requireSignIn middleware",
    });
  }
};

export const isSeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user.isSeller) {
      return res.status(403).send({
        success: false,
        message: "Access Denied. Sellers only.",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in isSeller middleware",
    });
  }
};

// import { expressjwt } from "express-jwt";

// export const requireSignIn = expressjwt({
//   secret: `${process.env.JWT_SECRET}`,
//   algorithms: ["HS256"],
//   requestProperty: "user",
// });

// // middlewares/authMiddleware.js
// export const isAdmin = (req, res, next) => {
//   if (req.user?.role !== "admin") {
//     return res.status(403).send({
//       success: false,
//       message: "Access Denied. Admins only.",
//     });
//   }
//   next();
// };

// export const isSeller = (req, res, next) => {
//   if (req.user?.role !== "seller") {
//     return res.status(403).send({
//       success: false,
//       message: "Access Denied. Sellers only.",
//     });
//   }
//   next();
// };

// // middlewares/authMiddleware.js

// export const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     const userRole = req.user?.role;

//     if (!allowedRoles.includes(userRole)) {
//       return res.status(403).send({
//         success: false,
//         message: "Access denied. Unauthorized role.",
//       });
//     }

//     next();
//   };
// };
