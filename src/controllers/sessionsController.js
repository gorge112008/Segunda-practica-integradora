import { generateToken } from "../utils.js";

const sessionController = {
  getSession: async (req, res) => {
    try {
      if (req.user && (req.session.user || req.session.admin)) {
        const role = req.session.admin ? "admin" : "user";
        const userName = req.user.user.first_name;
        const session = req.user.user;
        req.session.counter++;
        const msj = `WELCOME BACK ${userName.toUpperCase()}, THIS IS YOUR ${
          req.session.counter
        } INCOME.`;
        res.sendSuccess(200, { msj: msj, session: session, role: role });
      } else {
        res.sendUserError(401, { error: `No active session` });
      }
    } catch (error) {
      res.sendServerError({ error: "Error reading session" + error });
    }
  },
  getCurrentSession: async (req, res) => {
    try {
      const session = req.user;
      res.sendSuccess(200, session);
    } catch (error) {
      res.sendServerError({ error: "Error reading session" + error });
    }
  },
  getFailLogin: async (req, res) => {
    try {
      res.sendUserError(401, { error: `Invalid email or password` });
    } catch (error) {
      res.sendServerError({ error: "Error reading session" + error });
    }
  },
  getFailRegister: async (req, res) => {
    try {
      res.sendUserError(401, { error: `Email already registered` });
    } catch (error) {
      res.sendServerError({ error: "Error reading session" + error });
    }
  },
  getFailForgot: async (req, res) => {
    try {
      res.sendUserError(401, { error: `Invalid email` });
    } catch (error) {
      res.sendServerError({ error: "Error reading session" + error });
    }
  },
  getLogout: async (req, res) => {
    try {
      res.clearCookie("connect.sid");
      res.clearCookie("SessionCookie");
      res.clearCookie("coderCookieToken");
      req.session.destroy((err) => {
        if (err) {
          res.sendServerError({ error: "Error destroying session" + err });
        } else {
            const msj = `YOU HAVE ENDED YOUR SESSION SUCCESSFULLY`;
          res.sendSuccess(200, msj);
        }
      });
    } catch (error) {
      res.sendServerError({ error: "Error destroying session" + error });
    }
  },
  getGitHubSession: async (req, res) => {},
  getGitHubCallBack: async (req, res) => {
    try {
      const role = req.session.admin ? "admin" : "user";
      const userName = req.user.first_name;
      const session = req.user;
      const msj = `WELCOME ${userName.toUpperCase()}`;
      req.session.counter = 1;
      const login = { msj: msj, role: role };
      const token = generateToken(session);
      res.cookie("coderCookieToken", token, {
        maxAge: 60 * 60 * 1000,
        signed: true,
      });
      res.cookie("login", login);
          res.redirect("/github");
    } catch (error) {
      res.sendServerError({ error: "Not exist any session: " + error });
    }
  },
  postLogin: async (req, res) => {
    try {
      const role = req.session.admin ? "admin" : "user";
      const userName = req.user.first_name;
      const session = req.user;
      const msj = `WELCOME ${userName.toUpperCase()}`;
      req.session.counter = 1;
      const token = generateToken(session);
      res.cookie("coderCookieToken", token, {
        maxAge: 60 * 60 * 1000,
        signed: true,
      });
      res.sendSuccess(200, {
        success: msj,
        session: session,
        role: role,
        token: token,
      });
    } catch (error) {
      res.sendServerError({ error: "Not exist any session: " + error });
    }
  },
  postSignup: async (req, res) => {
    try {
      if (req.user && !req.user.error) {
        const msj = {
          success: `Email ${req.user.email} successfully registered`,
        };
        res.sendSuccess(201, msj);
      } else {
        res.sendUserError(401, { error: `Email already registered` });
      }
    } catch (error) {
      res.sendServerError({ error: "Error reading session" + error });
    }
  },
  postForgot: async (req, res) => {
    try {
      const msj = { success: "Success!" };
      res.sendSuccess(200, msj);
    } catch (error) {}
  },
  getNotFound: async (req, res) => {
    try {
      res.sendUserError(404, { error: `Route not found` });
    } catch (error) {
      res.sendServerError({ error: "Error reading session" + error });
    }
  },
};

export default sessionController;
