import { Router } from "express";
import { CartFM, ProductFM } from "../../dao/Mongo/classes/DBmanager.js";
import { authToken } from "../../utils.js";

const routerCarts = Router();

/*****************************************************************GET*************************************************************/
routerCarts.get("/carts", async (req, res) => {
  try {
    let carts = await CartFM.getCarts();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerCarts.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    let cart = await CartFM.getCartId(cid);
    res.status(200).send(cart);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*****************************************************************POST*************************************************************/
/* RUTAS PARA CREAR CARRITOS Y AGREGAR PRODUCTOS CON POST*/
routerCarts.post("/carts",authToken, async (req, res) => {
  //Opcion para crear un nuevo carrito vacio
  try {
    const newCart = req.body;
    const response = await CartFM.addCart(newCart);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerCarts.post("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const reqProducts = req.body;
    const newProducts = reqProducts.products;
    let productsFind = [];
    if (newProducts[0].payload) {
      newProducts[0].payload.forEach((productItem) => {
        if (productItem._id) {
          let find = 0;
          productsFind.forEach((findItem) => {
            if (productItem._id == findItem.product) {
              findItem.quantity++;
              find = 1;
            }
          });
          if (find == 0) {
            productsFind.push({ product: productItem._id, quantity: 1 });
          }
        }
      });
      newProducts[0].payload = productsFind;
      reqProducts.products = newProducts[0];
      const response = await CartFM.updateCart(cid, reqProducts);
      res.status(200).json(response);
    } else {
      res.status(400).json({ error: "Bad Request--> The cart is not valid" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerCarts.post("/carts/:cid/products/:pid",authToken, async function (req, res) {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const arrayProducts = await CartFM.getCarts();
    const responsecid = await CartFM.getCartId(cid);
    const responsepid = await ProductFM.getProductId(pid);
    if (!isNaN(responsepid) || !isNaN(responsecid)) {
      res.status(400).send(`Error --> The route is not valid`);
    } else {
      arrayProducts.forEach(async (cartItem) => {
        //res.status(200).send("ARRAY"+cartItem._id+"CID:::"+cid);
        if (cartItem._id == cid) {
          //SI EL ARREGLO TIENE LA ID DEL CARRITO SE ENTRA
          let find = 0;
          const cartProducts = cartItem.products;
          cartProducts[0].payload.forEach((productItem) => {
            if (productItem.product == pid) {
              //SI EL PRODUCTO TIENE LA ID REPETIDA SE SUMA
              productItem.quantity++;
              find = 1;
              res
                .status(200)
                .json({ msj: "Product Added to Cart Successfully!!!" });
            }
          });
          if (find == 0) {
            cartProducts[0].payload.push({
              product: responsepid[0]._id,
              quantity: 1,
            });
            res
              .status(200)
              .json({ msj: "Product Added to Cart Successfully!!!" });
          }
          const updateProducts = { products: cartProducts[0] };
          await CartFM.updateCart(cid, updateProducts);
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/******************************************************************PUT************************************************************/
routerCarts.put("/carts/:cid",authToken, async (req, res) => {
  try {
    const cid = req.params.cid;
    const reqProducts = req.body;
    let cart = await CartFM.getCartId(cid);
    cart[0].products = [{ status: "sucess", payload: reqProducts }];
    const response = await CartFM.updateCart(cid, cart[0]);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerCarts.put("/carts/:cid/products/:pid",authToken, async function (req, res) {
  try {
    const stock = req.body.stock;
    const quantity = req.body.quantity;
    const cid = req.params.cid;
    const pid = req.params.pid;
    const arrayProducts = await CartFM.getCarts();
    const responsecid = await CartFM.getCartId(cid);
    const responsepid = await ProductFM.getProductId(pid);
    if (!isNaN(responsepid) || !isNaN(responsecid)) {
      res.status(404).json({ error: `Error --> The route is not valid` });
    } else {
      arrayProducts.forEach(async (cartItem) => {
        //res.status(200).send("ARRAY"+cartItem._id+"CID:::"+cid);
        if (cartItem._id == cid) {
          //SI EL ARREGLO TIENE LA ID DEL CARRITO SE ENTRA
          let find = 0;
          const cartProducts = cartItem.products;
          cartProducts[0].payload.forEach((productItem) => {
            if (productItem.product == pid) {
              //SI EL PRODUCTO TIENE LA ID REPETIDA SE SUMA
              let msj = "NULL ACTION";
              if (stock > 0) {
                productItem.quantity += +stock;
                msj = { msj: "Product Added to Cart Successfully!!!" };
              } else if (quantity > 0) {
                productItem.quantity -= +quantity;
                msj = { msj: "Product Deleted of Cart Successfully!!!" };
              }
              find = 1;
              res.status(200).json(msj);
            }
          });
          if (find == 0) {
            let msj = "NULL ACTION";
            if (stock > 0) {
              cartProducts[0].payload.push({
                product: responsepid[0]._id,
                quantity: stock,
              });
              msj = { msj: "Product Added to Cart Successfully!!!" };
            } else if (quantity > 0) {
              msj = { msj: "Product Added to Cart Failed - No stock" };
            }
            res.status(200).json(msj);
          }
          const updateProducts = { products: cartProducts[0] };
          await CartFM.updateCart(cid, updateProducts);
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*****************************************************************DELETE*************************************************************/
routerCarts.delete("/carts/:cid/delete",authToken, async (req, res) => {
  //Opcion para Eliminar el carrito especifico
  try {
    const cid = req.params.cid;
    await CartFM.deleteCart(cid);
    res.status(200).json({ msj: "DELETED CART SUCCESSFULLY" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerCarts.delete("/carts/:cid",authToken, async (req, res) => {
  //Opcion para Eliminar solo los productos del carrito especifico
  try {
    const cid = req.params.cid;
    let cart = await CartFM.getCartId(cid);
    cart[0].products = [{ status: "sucess", payload: [] }];
    const response = await CartFM.updateCart(cid, cart[0]);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerCarts.delete("/carts/:cid/products/:pid",authToken, async function (req, res) {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const arrayCarts = await CartFM.getCarts();
    arrayCarts.forEach(async (cartItem) => {
      if (cartItem._id == cid) {
        //SI EL ARREGLO TIENE LA ID DEL CARRITO SE ENTRA
        const cartProducts = cartItem.products;
        const payloadProducts = cartProducts[0].payload;
        const newPayload = [];
        payloadProducts.forEach((productItem) => {
          if (productItem.product == null || productItem.product == pid) {
          } else {
            newPayload.push(productItem);
          }
        });
        newPayload != [] && payloadProducts == newPayload;
        cartProducts[0].payload = newPayload;
        const updateProducts = { products: cartProducts[0] };
        await CartFM.updateCart(cid, updateProducts);
        res.status(200).json({ msj: "DELETED SUCCESSFULLY" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default routerCarts;
