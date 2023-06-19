import AppRouter from "../router.js";
import auth from "../../middlewares/authMiddleware.js";
import { passportCall } from "../../utils.js";
import sessionController from "../../controllers/sessionsController.js";

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
      sessionController.getSession
    );

    this.getSession(
      "/sessions/current",
      ["PUBLIC"],
      passportCall("jwt", { session: false }),
      sessionController.getCurrentSession
    );

    this.getData(
      "/sessions/faillogin",
      ["PUBLIC"],
      sessionController.getFailLogin
    );

    this.getData(
      "/sessions/failregister",
      ["PUBLIC"],
      sessionController.getFailRegister
    );

    this.getData(
      "/sessions/failforgot",
      ["PUBLIC"],
      sessionController.getFailForgot
    );

    this.getData("/sessions/logout", ["PUBLIC"], sessionController.getLogout);

    this.getData(
      "/sessions/github",
      ["PUBLIC"],
      passportCall("github", {
        scope: ["user:email"],
      }),
      sessionController.getGitHubSession
    );
    this.getData(
      "/sessions/githubcallback",
      ["PUBLIC"],
      passportCall("github", {
        failureRedirect: "/login",
      }),
      auth,
      sessionController.getGitHubCallBack
    );

    this.postData(
      "/sessions/login",
      ["PUBLIC"],
      passportCall("login", {
        failureRedirect: "/api/sessions/faillogin",
      }),
      auth,
      sessionController.postLogin
    );
    this.postData(
      "/sessions/signup",
      ["PUBLIC"],
      passportCall("signup", {
        failureRedirect: "/api/sessions/failregister",
      }),
      sessionController.postSignup
    );
    this.postData(
      "/sessions/forgot",
      ["PUBLIC"],
      passportCall("forgot", {
        failureRedirect: "/api/sessions/failforgot",
      }),
      sessionController.postForgot
    );
    this.getData("*", sessionController.getNotFound);
  }
}
