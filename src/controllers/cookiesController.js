const cookiesController = {
  getUserCookie: async (req, res) => {
    try {
      const userCookie = req.signedCookies.UserCookie;
      userCookie
        ? res.send({ email: userCookie.email })
        : res.send({ email: "" });
    } catch (error) {
      res.sendServerError({ error: err });
    }
  },
  getTokenCookie: async (req, res) => {
    try {
      const tokenCookie = req.signedCookies.coderCookieToken;
      tokenCookie ? res.json(tokenCookie) : res.json("");
    } catch (err) {
      res.sendServerError({ error: err });
    }
  },
  getSessionCookie: async (req, res) => {
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
      res.sendServerError({ error: "Error reading session " + error });
    }
  },
  setUserCookie: async (req, res) => {
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
  },
  delCookie: async (req, res) => {
    try {
      const nameCookie = req.body.name;
      res.clearCookie(nameCookie);
      res.send("Cookie borrada");
    } catch (err) {
      res.sendServerError({ error: err });
    }
  },
};

export default cookiesController;
