import { Router } from "express";
import { ProductFM } from "../../dao/Mongo/classes/DBmanager.js";
import middlewareGetProducts from "../../middlewares/getProductsMiddleware.js";
import { authToken } from "../../utils.js";

const routerProducts = Router();

/*****************************************************************GET*************************************************************/
routerProducts.get("/products", middlewareGetProducts, async (req, res) => {
  try {
    const products = res.locals.products;
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: err });
  }
});

routerProducts.get("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    let product = await ProductFM.getProductId(pid);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*****************************************************************POST*************************************************************/
routerProducts.post("/products",authToken, async (req, res) => {
  try {
    const newProduct = req.body;
    let response = await ProductFM.addProduct(newProduct);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*****************************************************************PUT*************************************************************/
routerProducts.put("/products/:pid",authToken, async (req, res) => {
  try {
    const pid = req.params.pid;
    const body = req.body;
    let response = await ProductFM.updateProduct(pid, body);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*****************************************************************DELETE*************************************************************/
routerProducts.delete("/products/:pid",authToken, async (req, res) => {
  try {
    const pid = req.params.pid;
    await ProductFM.deleteProduct(pid);
    res.status(200).json(pid);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default routerProducts;
