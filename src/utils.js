import { fileURLToPath } from "url";
import { dirname } from "path";
import brcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";

const PRIVATE_KEY = "CoderKeyQueFuncionaComoUnSecret";

export const createHash = (password) =>
  brcrypt.hashSync(password, brcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  brcrypt.compareSync(password, user);

export const generateToken = (user) => {
  const creationTime = new Date();
  const token = jwt.sign({ user, creationTime }, PRIVATE_KEY, {
    expiresIn: "1h",
  });
  return token;
};

export const authToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .json({ error: "Authentication Error!, please login again" });
    const token = authHeader.split(" ")[1];
    jwt.verify(token, PRIVATE_KEY, (err, credentials) => {
      if (err)
        return res.status(403).json({
          error: "Expired or invalid authorization, please login again",
        });
      req.user = credentials.user;
      next();
    });
  } catch (error) {
    const err = { error: "Internal Server Error" };
    return res.status(500).json(err);
  }
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        if (req.path === "/sessions/current") return res.status(401).json({
          error: info.message
            ? info.message + ", please login again"
            : "Unauthorized, please login again",
        });
        if (req.path === "/sessions/session") {
          if (req.session.counter) {
            const session = req.session.admin
              ? req.session.admin
              : req.session.user;
            const msj = "Logout and Login Again Please...";
            return res.status(200).json({
              success: msj,
              session: session,
              role: session.role,
            });
          } else {
            return res.status(401).json({
              error: info.message
                ? info.message + ", please login again"
                : "Unauthorized, please login again",
            });
          }
        } else {
          return res.status(401).render("unauthorized", { isLogin: true });
        }
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).send({ error: "Unauthorized" });
    if (!role.includes(req.user.user.role))
      if (role.includes("admin")) {
        return res.status(403).render("private/noAdmin", { isLogin: true });
      } else {
        return res.status(403).send({ error: "No permissions" });
      }
    next();
  };
};

const __filename = fileURLToPath(import.meta.url); //Obtener la ruta absoluta del directorio actual
const __dirname = dirname(__filename);

export { __dirname };
