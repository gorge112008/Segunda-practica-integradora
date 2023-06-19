import AppRouter from "../router.js";
//import { CartDAO, ProductDAO } from "../../dao/Mongo/classes/DBmanager.js";
import { CartDAO, ProductDAO } from "../../dao/index.js";

export default class CartsRouter extends AppRouter {
  constructor() {
    super();
    this.init();
  }
  init() {
    /*****************************************************************GET*************************************************************/
    this.getData("/carts", ["PUBLIC"], async (req, res) => {
      try {
        let carts = await CartDAO.getCarts();
        res.sendSuccess(200, carts);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    this.getData("/carts/:cid", ["PUBLIC"], async (req, res) => {
      try {
        const cid = req.params.cid;
        let cart = await CartDAO.getCartId(cid);
        res.sendSuccess(200, cart);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });

    //FORK PARA FUTURAS IMPLEMENTACIONES
   /* this.getData("/buyProcess", ["PUBLIC"], async (req, res) => {
      try {
        const child = fork("./src/buyProcess.js");
        child.send("start");
        child.on("message", (message) => {
          console.log("Mensaje del hijo", message);
          res.sendSuccess(200, message);
        });
      } catch (error) {
        res.sendServerError({ error: err });
      }
    });*/

    /*****************************************************************POST*************************************************************/
    this.postData("/carts", ["USER"], async (req, res) => {
      try {
        const newCart = req.body;
        const response = await CartDAO.addCart(newCart);
        res.sendSuccess(200, response);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
    this.postData("/carts/:cid", ["PUBLIC"], async (req, res) => {
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
          const response = await CartDAO.updateCart(cid, reqProducts);
          res.sendSuccess(200, response);
        } else {
          res.sendUserError(400, {
            error: "Bad Request--> The cart is not valid",
          });
        }
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
    this.postData("/carts/:cid/products/:pid", ["USER"], async (req, res) => {
      try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const arrayProducts = await CartDAO.getCarts();
        const responsecid = await CartDAO.getCartId(cid);
        const responsepid = await ProductDAO.getProductId(pid);
        if (!isNaN(responsepid) || !isNaN(responsecid)) {
          res.sendUserError(400, { error: `Error --> The route is not valid` });
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
                  res.sendSuccess(200, {
                    msj: "Product Added to Cart Successfully!!!",
                  });
                }
              });
              if (find == 0) {
                cartProducts[0].payload.push({
                  product: responsepid[0]._id,
                  quantity: 1,
                });
                res.sendSuccess(200, {
                  msj: "Product Added to Cart Successfully!!!",
                });
              }
              const updateProducts = { products: cartProducts[0] };
              await CartDAO.updateCart(cid, updateProducts);
            }
          });
        }
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
    /******************************************************************PUT************************************************************/
    this.updateData("/carts/:cid", ["USER"], async (req, res) => {
      try {
        const cid = req.params.cid;
        const reqProducts = req.body;
        let cart = await CartDAO.getCartId(cid);
        cart[0].products = [{ status: "sucess", payload: reqProducts }];
        const response = await CartDAO.updateCart(cid, cart[0]);
        res.sendSuccess(200, response);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
    this.updateData("/carts/:cid/products/:pid", ["USER"], async (req, res) => {
      try {
        const stock = req.body.stock;
        const quantity = req.body.quantity;
        const cid = req.params.cid;
        const pid = req.params.pid;
        const arrayProducts = await CartDAO.getCarts();
        const responsecid = await CartDAO.getCartId(cid);
        const responsepid = await ProductDAO.getProductId(pid);
        if (!isNaN(responsepid) || !isNaN(responsecid)) {
          res.sendUserError(404, { error: `Error --> The route is not valid` });
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
                  res.sendSuccess(200, msj);
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
                res.sendSuccess(200, msj);
              }
              const updateProducts = { products: cartProducts[0] };
              await CartDAO.updateCart(cid, updateProducts);
            }
          });
        }
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
    /*****************************************************************DELETE*************************************************************/
    this.deleteData("/carts/:cid/delete", ["USER"], async (req, res) => {
      try {
        const cid = req.params.cid;
        await CartDAO.deleteCart(cid);
        res.sendSuccess(200, { msj: "DELETED CART SUCCESSFULLY" });
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
    this.deleteData("/carts/:cid", ["USER"], async (req, res) => {
      try {
        const cid = req.params.cid;
        let cart = await CartDAO.getCartId(cid);
        cart[0].products = [{ status: "sucess", payload: [] }];
        const response = await CartDAO.updateCart(cid, cart[0]);
        res.sendSuccess(200, response);
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
    this.deleteData("/carts/:cid/products/:pid", ["USER"], async (req, res) => {
      try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const arrayCarts = await CartDAO.getCarts();
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
            await CartDAO.updateCart(cid, updateProducts);
            res.sendSuccess(200, { msj: "DELETED SUCCESSFULLY" });
          }
        });
      } catch (err) {
        res.sendServerError({ error: err });
      }
    });
  }
}
