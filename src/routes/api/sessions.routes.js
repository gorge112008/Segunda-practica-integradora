import { Router } from "express";
import auth from "../../middlewares/authMiddleware.js";
import { authorization, generateToken, passportCall } from "../../utils.js";

const routerSessions = Router();

/*****************************************************************GET*************************************************************/
routerSessions.get("/sessions/session",passportCall("jwt"), (req, res) => {
  try {
    if (req.user) {
      const role = req.session.admin ? "admin" : "user";
      const userName = req.user.user.first_name;
      const session = req.user.user;
      req.session.counter++;
      const msj = `WELCOME BACK ${userName.toUpperCase()}, THIS IS YOUR ${
        req.session.counter
      } INCOME.`;
      res.status(200).json({ msj: msj, session: session, role: role });
    } else {
      res.status(401).json({ error: `No active session` });
    }
  } catch (error) {
    console.error("Error reading session " + error);
  }
});

routerSessions.get(
  "/sessions/current",
  passportCall("jwt", { session: false }),
  authorization("user"),
  async (req, res) => {
    try {
      const session = req.user;
      res.send(session);
    } catch (error) {
      console.error("Error reading session " + error);
    }
  }
);

routerSessions.get(
  "/sessions/github",
  passportCall("github", {
    scope: ["user:email"],
  }),
  async (req, res) => {}
);

routerSessions.get(
  "/sessions/githubcallback",
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
      res.cookie("login", login);
      res.redirect("/github");
    } catch (error) {}
  }
);

routerSessions.get("/sessions/logout", (req, res) => {
  res.clearCookie("connect.sid");
  res.clearCookie("SessionCookie");
  res.clearCookie("coderCookieToken");
  req.session.destroy((err) => {
    if (err) {
      res.send("Failed to sign out");
    } else {
      const msj = `YOU HAVE ENDED YOUR SESSION SUCCESSFULLY`;
      res.status(200).json(msj);
    }
  });
});

routerSessions.get("/sessions/failregister", (req, res) => {
  const err = { error: "The user is already registered!" };
  res.status(409).json(err);
});

routerSessions.get("/sessions/faillogin", (req, res) => {
  const err = { error: "An error has occurred with your credentials!" };
  res.status(404).json(err);
});

routerSessions.get("/sessions/failforgot", (req, res) => {
  const err = { error: "An error has occurred with your credentials!" };
  res.status(404).json(err);
});

/*****************************************************************POST*************************************************************/
routerSessions.post(
  "/sessions/login",
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
      res
        .status(200)
        .json({ success: msj, session: session, role: role, token: token });
    } catch (error) {
      console.error("Not exist any session: " + error);
    }
  }
);

routerSessions.post(
  "/sessions/signup",
  passportCall("signup", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    try {
      if (req.user && !req.user.error) {
        const msj = {
          success: `Email ${req.user.email} successfully registered`,
        };
        res.status(201).json(msj);
      } else {
        const err = { error: "An error occurred with the registration" };
        res.status(400).json(err);
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

routerSessions.post(
  "/sessions/forgot",
  passportCall("forgot", {
    failureRedirect: "/api/sessions/failforgot",
  }),
  async (req, res) => {
    try {
      const msj = { success: "Success!" };
      res.status(200).json(msj);
    } catch (error) {}
  }
);

routerSessions.get("*", async (req, res) => {
  res.status(404).send("ROUTE ERROR");
});

export default routerSessions;

