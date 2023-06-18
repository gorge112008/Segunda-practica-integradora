import AppRouter from "../router.js";

export default class CookiesRouter extends AppRouter {
  constructor() {
    super();
    this.init();
  }
  init() {
    /*****************************************************************GET*************************************************************/
    this.getData("/getUserCookie", ["PUBLIC"], async (req, res) => {
      try {
        const userCookie = req.signedCookies.UserCookie;
        userCookie
          ? res.send({ email: userCookie.email })
          : res.send({ email: "" });
      } catch (error) {
        res.sendServerError({ error: err });
      }
    });
    this.getData("/getTokenCookie", ["PUBLIC"], async (req, res) => {
      try {
        const tokenCookie = req.signedCookies.coderCookieToken;
        tokenCookie ? res.json(tokenCookie) : res.json("");
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
    this.getData("/getSessionCookie", ["PUBLIC"], async (req, res) => {
      try {
        const sessionCookie = req.signedCookies.connect.sid
          ? req.signedCookies.connect.sid
          : null;
        if (sessionCookie) {
          res.send({ data: sessionCookie });
        } else {
          res.send({ data: "" });
        }
      } catch (error) {
        res.sendServerError({error: "Error reading session " + error});
      }
    });

    /*****************************************************************POST*************************************************************/
    this.postData("/setUserCookie", ["USER"], async (req, res) => {
      try {
        const { user, timer } = req.body;
        const time = timer ? timer : null;
        res.cookie(
          "UserCookie",
          { email: user },
          {
            maxAge: time,
            signed: true,
          }
        );
        res.send({ email: user });
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    /*****************************************************************DELETE*************************************************************/
    this.deleteData("/delCookie", ["USER"], async (req, res) => {
      try {
        const nameCookie = req.body.name;
        res.clearCookie(nameCookie);
        res.send("Cookie borrada");
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
  }
}
