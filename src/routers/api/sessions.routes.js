import AppRouter from "../router.js";
import auth from "../../middlewares/authMiddleware.js";
import { authorization, generateToken, passportCall } from "../../utils.js";
export default class SessionsRouter extends AppRouter {
  constructor() {
    super();
    this.init();
  }
  init() {
    this.getSession(
      "/sessions/session",
      ["PUBLIC"],
      passportCall("jwt"),
      async (req, res) => {
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
      }
    );

    this.getSession(
      "/sessions/current",
      ["PUBLIC"],
      passportCall("jwt", { session: false }),
      async (req, res) => {
        try {
          const session = req.user;
          res.sendSuccess(200, session);
        } catch (error) {
          res.sendServerError({ error: "Error reading session " + error });
        }
      }
    );

    this.getData("/sessions/faillogin", ["PUBLIC"], (req, res) => {
      const err = { error: "An error has occurred with your credentials!" };
      res.sendUserError(404, err);
    });

    this.getData("/sessions/failregister", ["PUBLIC"], (req, res) => {
      const err = { error: "The user is already registered!" };
      res.sendUserError(409, err);
    });

    this.getData("/sessions/failforgot", ["PUBLIC"], (req, res) => {
      const err = { error: "An error has occurred with your credentials!" };
      res.sendUserError(404, err);
    });

    this.getData(
      "/sessions/github",
      ["PUBLIC"],
      passportCall("github", {
        scope: ["user:email"],
      }),
      async (req, res) => {}
    );
    this.getData(
      "/sessions/githubcallback",
      ["PUBLIC"],
      passportCall("github", {
        failureRedirect: "/login",
      }),
      auth,
      async (req, res) => {
        try {
          const session = req.user;
          req.session.counter = 1;
          const role = req.session.admin ? "admin" : "user";
          const userName = req.user.first_name;
          const msj = `WELCOME ${userName.toUpperCase()}`;
          const login = { msj: msj, role: role };
          const token = generateToken(session);
          res.cookie("coderCookieToken", token, {
            maxAge: 60 * 60 * 1000,
            signed: true,
          });
          res.cookie("login", login);
          res.redirect("/github");
        } catch (error) {}
      }
    );
    this.getData("/sessions/logout", ["PUBLIC"], (req, res) => {
      res.clearCookie("connect.sid");
      res.clearCookie("SessionCookie");
      res.clearCookie("coderCookieToken");
      req.session.destroy((err) => {
        if (err) {
          res.sendServerError({ error: "Failed to sign out" });
        } else {
          const msj = `YOU HAVE ENDED YOUR SESSION SUCCESSFULLY`;
          res.sendSuccess(200, msj);
        }
      });
    });
    this.postData(
      "/sessions/login",
      ["PUBLIC"],
      passportCall("login", {
        failureRedirect: "/api/sessions/faillogin",
      }),
      auth,
      async (req, res) => {
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
      }
    );
    this.postData(
      "/sessions/signup",
      ["PUBLIC"],
      passportCall("signup", {
        failureRedirect: "/api/sessions/failregister",
      }),
      async (req, res) => {
        try {
          if (req.user && !req.user.error) {
            const msj = {
              success: `Email ${req.user.email} successfully registered`,
            };
            res.sendSuccess(201, msj);
          } else {
            const err = { error: "An error occurred with the registration" };
            res.sendUserError(400, err);
          }
        } catch (error) {
          res.sendServerError({ error: error });
        }
      }
    );
    this.postData(
      "/sessions/forgot",
      ["PUBLIC"],
      passportCall("forgot", {
        failureRedirect: "/api/sessions/failforgot",
      }),
      async (req, res) => {
        try {
          const msj = { success: "Success!" };
          res.sendSuccess(200, msj);
        } catch (error) {}
      }
    );
  }
}
