import AppRouter from "./router.js";
import middlewareInitProducts from "../middlewares/initProductsMiddleware.js";
import middlewareInitMessages from "../middlewares/initMessagesMiddleware.js";
import middlewareInitCart from "../middlewares/initCartMiddleware.js";
import validateSession from "../middlewares/validateSessionMiddleware.js";
import publicController from "../controllers/publicController.js";
import privateController from "../controllers/privateController.js";
import { authorization, generateToken, passportCall } from "../utils.js";

export default class ViewsRouter extends AppRouter {
  constructor() {
    super();
    this.init();
  }
  init() {
    this.getRoute("/", ["PUBLIC"], publicController.login);

    this.getRoute("/login", ["PUBLIC"], publicController.login);

    this.getRoute("/signup", ["PUBLIC"], publicController.signup);

    this.getRoute("/forgot", ["PUBLIC"], publicController.forgot);

    this.getRoute("/github", ["PUBLIC"], publicController.github);

    this.getRoute("/profile", ["USER"],validateSession, publicController.profile);

    this.getRoute(
      "/home",
      ["PUBLIC"],
      passportCall("jwt"),
      middlewareInitProducts,
      publicController.home
    );

    this.getRoute(
      "/realtimeproducts",
      ["ADMIN"],
      passportCall("jwt"),
      middlewareInitProducts,
      privateController.realtimeproducts
    );

    this.getRoute(
      "/realtimeproducts/:pid",
      ["ADMIN"],
      passportCall("jwt"),
      middlewareInitProducts,
      privateController.realtimeproducts
    );

    this.getRoute(
      "/products",
      ["PUBLIC"],
      passportCall("jwt"),
      middlewareInitProducts,
      publicController.products
    );

    this.getRoute(
      "/products/:pid",
      ["PUBLIC"],
      passportCall("jwt"),
      middlewareInitProducts,
      publicController.products
    );

    this.getRoute(
      "/cart",
      ["PUBLIC"],
      passportCall("jwt"),
      middlewareInitCart,
      publicController.carts
    );

    this.getRoute(
      "/cart/:cid",
      ["PUBLIC"],
      passportCall("jwt"),
      middlewareInitCart,
      publicController.carts
    );

    this.getRoute(
      "/chat",
      ["PUBLIC"],
      passportCall("jwt"),
      middlewareInitMessages,
      publicController.chat
    );
  }
}
