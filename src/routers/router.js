import { Router } from "express";
import jwt from "jsonwebtoken";

export default class AppRouter {
  constructor() {
    this.router = Router();
    this.init();
  }
  Routers() {
    return this.router;
  }
  init() {}

  getRoute(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }

  getSession(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  getData(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.authPolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }
  postData(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.authPolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }
  updateData(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.authPolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }
  deleteData(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.authPolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (err) {
        console.log(err);
        params[1].status(500).json(err);
      }
    });
  }

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = (status, payload) => res.status(status).json(payload);
    res.sendServerError = (error) => res.status(500).send(error);
    res.sendUserError = (status, error) => res.status(status).send(error);
    next();
  };

  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] === "PUBLIC") return next();
    if (policies.includes("ADMIN")) {
      if (!req.session.admin)
        return res.status(403).render("private/noAdmin", { isLogin: true });
    }
    if (policies.includes("USER")) {
      if (!req.session.user && !req.session.admin)
        return res.status(401).render("redirection", { isLogin: true });
    }
    next();
  };

  authPolicies = (policies) => (req, res, next) => {
    if (policies[0] === "PUBLIC") return next();
    if (policies.includes("ADMIN") || policies.includes("USER")) {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res
            .status(401)
            .json({ error: "Authentication Error!, please login again" });
        } else {
          const token = authHeader.split(" ")[1];
          jwt.verify(
            token,
            "CoderKeyQueFuncionaComoUnSecret",
            (err, credentials) => {
              if (err)
                return res.status(403).json({
                  error: "Expired or invalid authorization, please login again",
                });
              req.user = credentials.user;
              next();
            }
          );
        }
      } catch (error) {
        const err = { error: "Internal Server Error" };
        return res.status(500).json(err);
      }
    }
  };
}
