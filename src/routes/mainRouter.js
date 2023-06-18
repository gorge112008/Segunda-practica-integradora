import { Router } from "express";
import middlewareInitProducts from "../middlewares/initProductsMiddleware.js";
import middlewareInitMessages from "../middlewares/initMessagesMiddleware.js";
import middlewareInitCart from "../middlewares/initCartMiddleware.js";
import validateSession from "../middlewares/validateSessionMiddleware.js";
import publicController from "../controllers/publicController.js";
import privateController from "../controllers/privateController.js";
import { authorization , passportCall} from "../utils.js";

const routerViews = Router();

routerViews.get("/", publicController.login);

routerViews.get("/login", publicController.login);

routerViews.get("/signup", publicController.signup);

routerViews.get("/forgot", publicController.forgot);

routerViews.get("/github", publicController.github)

routerViews.get("/profile", validateSession, publicController.profile);

routerViews.get(
  "/home",
  passportCall("jwt"),
  authorization(["user", "admin"]),
  middlewareInitProducts,
  publicController.home
);

routerViews.get(
  "/realtimeproducts",
  passportCall("jwt"),
  authorization("admin"),
  middlewareInitProducts,
  privateController.realtimeproducts
);

routerViews.get(
  "/realtimeproducts/:pid",
  passportCall("jwt"),
  authorization("admin"),
  middlewareInitProducts,
  privateController.realtimeproducts
);

routerViews.get(
  "/products",
  passportCall("jwt"),
  authorization(["user", "admin"]),
  middlewareInitProducts,
  publicController.products
);

routerViews.get(
  "/products/:pid",
  passportCall("jwt"),
  authorization(["user", "admin"]),
  middlewareInitProducts,
  publicController.products
);

routerViews.get(
  "/cart",
  passportCall("jwt"),
  authorization(["user", "admin"]),
  middlewareInitCart,
  publicController.carts
);

routerViews.get(
  "/cart/:cid",
  passportCall("jwt"),
  authorization(["user", "admin"]),
  middlewareInitCart,
  publicController.carts
);

routerViews.get(
  "/chat",
  passportCall("jwt"),
  authorization(["user", "admin"]),
  middlewareInitMessages,
  publicController.chat
);

export default routerViews;
