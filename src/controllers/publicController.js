let publicProducts, publicMessages, publicCarts;

const publicController = {
  index: (req, res) => {
    res.render("public/index", { isLogin: true, style: "/css/index.css" });
  },
  login: (req, res) => {
    res.render("public/login", { isLogin: true, style: "/css/login.css" });
  },
  signup: (req, res) => {
    res.render("public/signup", { isLogin: true, style: "/css/signup.css" });
  },
  forgot: (req, res) => {
    res.render("public/forgot", { isLogin: true, style: "/css/forgot.css" });
  },
  github: (req, res) => {
    const { msj, role } = req.cookies.login;
    res.clearCookie("login");
    res.render("public/github", { isLogin: true, msj: msj, role: role });
  },
  profile: (req, res) => {
    const { role, email } = res.locals.resUser;
    const resSession = res.locals.resSession;
    res.render("public/profile", {
      role: role,
      user: email,
      body: resSession,
      style: "/css/profile.css",
    });
  },
  home: (req, res) => {
    const { role, email } = req.user.user;
    publicProducts = res.locals.resProducts;
    res.render("public/home", {
      role: role,
      user: email,
      body: publicProducts,
    });
  },
  products: (req, res) => {
    const { role, email } = req.user.user;
    const user = req.user;
    publicProducts = res.locals.resProducts;
    res.render("public/products", {
      role: role,
      user: email,
      body: publicProducts,
    });
  },
  carts: (req, res) => {
    const { role, email } = req.user.user;
    publicCarts = res.locals.resCarts;
    res.render("public/cart", { role: role, user: email, body: publicCarts });
  },
  chat: (req, res) => {
    const { role, email } = req.user.user;
    publicMessages = res.locals.resMessages;
    res.render("public/chat", {
      role: role,
      user: email,
      body: publicMessages,
    });
  },
};

export default publicController;
export { publicProducts, publicMessages, publicCarts };
