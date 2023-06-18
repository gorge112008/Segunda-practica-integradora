import AppRouter from "../router.js";
import { ProductFM } from "../../dao/Mongo/classes/DBmanager.js";
import middlewareGetProducts from "../../middlewares/getProductsMiddleware.js";
import { authToken } from "../../utils.js";

export default class ProductsRouter extends AppRouter {
  constructor() {
    super();
    this.init();
  }
  init() {
    this.getData(
      "/products",
      ["PUBLIC"],
      middlewareGetProducts,
      async (req, res) => {
        try {
          const products = res.locals.products;
          res.sendSuccess(200, products);
        } catch (error) {
          res.sendServerError({ error: err });
        }
      }
    );

    this.getData("/products/:pid", ["PUBLIC"], async (req, res) => {
      try {
        const pid = req.params.pid;
        let product = await ProductFM.getProductId(pid);
        res.sendSuccess(200, product);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    /*****************************************************************POST*************************************************************/
    this.postData("/products", ["USER"], async (req, res) => {
      try {
        console.log("Empezo post");
        const newProduct = req.body;
        let response = await ProductFM.addProduct(newProduct);
        res.sendSuccess(200, response);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    /*****************************************************************DELETE*************************************************************/
    this.updateData("/products/:pid", ["USER"], async (req, res) => {
      try {
        const pid = req.params.pid;
        const body = req.body;
        let response = await ProductFM.updateProduct(pid, body);
        res.sendSuccess(200, response);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    /*****************************************************************DELETE*************************************************************/
    this.deleteData("/products/:pid", ["USER"], async (req, res) => {
      try {
        const pid = req.params.pid;
        await ProductFM.deleteProduct(pid);
        res.sendSuccess(200, pid);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
  }
}
