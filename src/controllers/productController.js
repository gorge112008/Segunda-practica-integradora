//import { ProductDAO } from "../dao/Mongo/classes/DBmanager.js";
import { ProductDAO } from "../dao/index.js";

const productController = {
  getProducts: (req, res) => {
    try {
      const products = res.locals.products;
      res.sendSuccess(200, products);
    } catch (error) {
      res.sendServerError({ error: err });
    }
  },
  getProductId: async (req, res) => {
    try {
      const pid = req.params.pid;
      let product = await ProductDAO.getProductId(pid);
      res.sendSuccess(200, product);
    } catch (err) {
      res.sendServerError({ error: err });
    }
  },
  addProduct: async (req, res) => {
    try {
      const newProduct = req.body;
      let response = await ProductDAO.addProduct(newProduct);
      res.sendSuccess(200, response);
    } catch (err) {
      res.sendServerError({ error: err });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const pid = req.params.pid;
      const body = req.body;
      let response = await ProductDAO.updateProduct(pid, body);
      res.sendSuccess(200, response);
    } catch (err) {
      res.sendServerError({ error: err });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const pid = req.params.pid;
      await ProductDAO.deleteProduct(pid);
      res.sendSuccess(200, pid);
    } catch (err) {
      res.sendServerError({ error: err });
    }
  },
};
export default productController;
