/*CART*/

/*********************************************************CONSTANTES/VARIABLES*************************************************************/
const socket = io();
let URLorigin = window.location.origin,
  UrlP = URLorigin + "/api/products",
  UrlC = URLorigin + "/api/carts",
  UrlCook = URLorigin + "/api/";
let opc = "static";
let btnRemove, btnCloseView, btnRemoveCart, btnTransferCart, options;
let storeCarts = [],
  storeProducts = [],
  resExo = [],
  dataProducts = [],
  ListCarts = [];
let query = {};

const staticContain = document.querySelector(".static__container--cart"),
  titleCart = document.querySelector(".static__tittleCart"),
  containCart = document.querySelector(".container__cart");

/*****************************************************************CLASES*************************************************************/

class NewCart {
  constructor() {
    this.products = [{ status: "sucess", payload: [] }];
  }
}

class NewDataCart {
  constructor() {
    this.payload = [];
  }
}

/*****************************************************************FUNCIONES*************************************************************/
async function createListStock(stock) {
  let optListStock = [];
  for (let i = 1; i <= stock; i++) {
    optListStock[i] = i.toString();
  }
  return optListStock;
}

async function createListCarts(idCart) {
  let carts = await getDataCarts();
  let optListCarts = [];
  ListCarts = [];
  for (let i = 1; i <= carts.length; i++) {
    if (idCart != carts[i - 1]._id) {
      optListCarts[i] = `Cart (${i.toString()}): ${carts[i - 1]._id}`;
      ListCarts.push(carts[i - 1]._id);
    } else {
      ListCarts.push(carts[i - 1]._id);
    }
  }
  return optListCarts;
}

async function createHTMLCarts() {
  if (storeCarts.length == 0) {
    titleCart.innerHTML = `<p>Carts (${storeCarts.length}):</p>`;
    containCart.innerHTML = `<div class="container__empty__card">
            <div class="card">
              <div class="card-item--empty">
                <i class="fa-solid fa-cart-plus"></i></div>
              <div class="card-body--empty">
                <b class="card-text--empty">No Carts Found</b>
                <p class="card-text--empty">You have not created any cart</p>
                <p class="card-text--empty">Add first cart now</p>
              </div>
            </div>
          </div>`;
  } else {
    titleCart.innerHTML = "";
    containCart.innerHTML = "";
    let html;
    let int = -1;
    for (const cart of storeCarts) {
      let countQuantity = 0;
      let cartDetails = cart.products;
      let productsCart = cartDetails[0].payload;
      const unique =
        storeCarts.length == 1 || productsCart.length == [] ? "unique" : "";
      if (productsCart.length == 0) {
        //console.log("CART " + (int+1) + " EMPTY");
      } else {
        for (const product of productsCart) {
          if (product.quantity) {
            countQuantity += product.quantity;
          }
        }
      }
      int++;
      html = `<div class="container__cart__card">
          <div class="card col s12">
            <div class="card_cart--header row noMargin">
              <div class="cart-header--filled col s12">
                <h5 class="cart-title--filled">ID CART: ${cart._id}</h5>
              </div>
            </div>
            <div class="card_cart--body row noMargin">
              <div class="card_imgCart col s3 m3 l3">
                <img
                  src="https://w7.pngwing.com/pngs/225/984/png-transparent-computer-icons-shopping-cart-encapsulated-postscript-shopping-cart-angle-black-shopping.png"
                  class="img-fluid rounded-start"
                  alt="..."
                />
                <div class="card_imgCart--overlay">
                  <b>${int + 1}</b>
                </div>
              </div>
              <button
                type="button"
                class="btn fas fa-trash-alt btnRemoveCart"
                id=${cart._id}
              ></button>
              <button
                type="button"
                class="btn fa-solid fa-arrow-right-arrow-left btnTransferCart ${unique}"
                id=${cart._id}
              ></button>
              <div class="card_containCart col s8 m8 l8">
                <div class="loaded">
                  <b>
                    STATUS CARD:
                    <u class="aquamarine">
                      ***${cartDetails[0].status.toUpperCase()}***
                    </u>
                  </b>
                  <b>
                    QUANTITY OF PRODUCTS:
                    <b class="quantityP">${countQuantity}</b>
                  </b>
                </div>
                <button
                  type="button"
                  class="btn btn-outline-warning btn-sm btnViewCart"
                >
                  <a class="fa-regular fa-eye" href="/cart/${cart._id}"></a>
                </button>
              </div>
            </div>
          </div>
        </div>`;
      containCart.innerHTML += html;
    }
    titleCart.innerHTML = `<p>Carts (${storeCarts.length}):</p>`;
    btnTransferCart = document.querySelectorAll(".btnTransferCart");
    btnRemoveCart = document.querySelectorAll(".btnRemoveCart");
    return [btnRemoveCart, btnTransferCart];
  }
}

async function crearHTMLProductsCarts() {
  if (storeProducts.length == 0) {
    titleCart.innerHTML = `<p>Cart Empty</p>`;
    containCart.innerHTML = "";
    containCart.innerHTML = `<div class="container__empty__card">
        <div class="card">
          <div class="card-item--empty">
            <i class="fa-solid fa-rectangle-xmark fa-beat-fade"></i>
          </div>
          <div class="card-body--empty">
            <b class="card-text--empty">Not Products Found</b>
            <p class="card-text--empty">
              You have not added any product in this cart
            </p>
            <p class="card-text--empty">Try adding a product first</p>
          </div>
          <div class="card__footer--empty">
            <button
              type="button"
              class="btn fas fa-edit btnAddProduct"
            ></button>
          </div>
        </div>
      </div>`;
    btnClearCart.classList.add("hidden");
    btnAdd = document.querySelector(".btnAddProduct");
    return btnAdd;
  } else {
    containCart.innerHTML = "";
    let html, error;
    let count = 0;
    for (const listProduct of storeProducts) {
      const product = listProduct.product;
      product.stock == 0 ? (error = "error") : (error = "");
      /*if (product == null || listProduct.quantity == 0) {
        deletedProductCart(storeCarts[0]._id, product._id);
        continue;
      }*/
      count++;
      const total = product.price * listProduct.quantity;
      html = `<div class="container__grid__card">
          <div class="card">
            <div class="card-header--filled">
              <h5 class="card-title--filled">${product.tittle}</h5>
            </div>
            <img
              class="card-img-top--filled"
              src=${product.thumbnail}
              alt="Card image cap"
            />
            <div class="card-img-overlay">
              <button
                type="button"
                class="btn fas fa-trash-alt card__btnDelete"
                id=${product._id}
              ></button>
              <button
                type="button"
                class="btn btn-outline-warning btn-sm btnUpdate--Min"
                id=${product._id}
              >
                <i class="fa-regular fa-square-minus"></i>
              </button>
              <button
                type="button"
                class="btn btn-outline-warning btn-sm btnUpdate--Max ${error}"
                id=${product._id}
              >
                <i class="fa-regular fa-square-plus"></i>
              </button>
            </div>
            <div class="card-body">
              <b class="card-text--description">${product.description}</b>
              <u class="card-text--price">
                Precio Unitario: S/${product.price}
              </u>
              <b class="card-text--total">Precio Total: S/${total}</b>
            </div>
            <div class="card-footer">
              <b class="card-text--quantity">
                Cantidad: <b class="quantity">${listProduct.quantity}</b>
              </b>
            </div>
          </div>
        </div>`;
      containCart.innerHTML += html;
    }
    containCart.classList.replace("container__cart", "container__grid");
    staticContain.classList.replace(
      "static__container--cart",
      "static__container--grid"
    );
    btnClearCart.classList.remove("hidden");
    titleCart.innerHTML = `<p>Products Cart (${count}):</p>`;
    bnUpdateAdd = document.querySelectorAll(".btnUpdate--Max");
    btnUpdateDel = document.querySelectorAll(".btnUpdate--Min");
    btnAllDel = document.querySelectorAll(".card__btnDelete");
    return [bnUpdateAdd, btnUpdateDel, btnAllDel];
  }
}

async function focusAction() {
  const buttonsMax = document.querySelectorAll(".div__container--focusBtn a");
  const buttonsMin = document.querySelectorAll(".asideSD__dropdown--contain a");
  buttonsMax.forEach((button) => {
    button.href == window.location.href
      ? button.classList.add("active")
      : button.classList.remove("active");
  });

  buttonsMin.forEach((button) => {
    button.href == window.location.href
      ? button.classList.add("active")
      : button.classList.remove("active");
  });
}

async function selectAction() {
  if (RouteIndex === "cartP") {
    storeProducts = [];
    storeCarts = await getDataCarts();
    selectRemoveCart();
  } else if (RouteIndex === "cartP/") {
    socket.emit("viewingCart", storeCarts[0]._id);
    storeProducts = await getDataProductsbyID(storeCarts[0]._id);
    selectBtnCartProducts();
  }
}

async function validateStock(idProduct, stockModif, action) {
  const product = await getDataOneProductbyID(idProduct);
  const newStock =
    action == 1 ? product[0].stock + stockModif : product[0].stock - stockModif;
  await updateOneProductbyID(idProduct, { stock: newStock });
}

async function validateCartStock(idCart) {
  const listProducts = await getDataProductsbyID(idCart);
  for (const product of listProducts) {
    const idProduct = product.product._id;
    const stockModif = product.quantity;
    const action = 1;
    await validateStock(idProduct, stockModif, action);
  }
}

async function validatePayload(payload, listProducts) {
  for (const resproduct of listProducts) {
    const { quantity, ...rest } = resproduct;
    const { _id } = resproduct.product;
    const existingProduct = payload.find((p) => {
      return p.product._id == _id;
    });
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      payload.push({ ...rest, quantity });
    }
  }
  return payload;
}

async function TransferCart(idCartTransfer, idCartReceptor) {
  const listProduct1 = await getDataProductsbyID(idCartTransfer);
  const listProduct2 = await getDataProductsbyID(idCartReceptor);
  const newArrCart = new NewDataCart();
  let payload = newArrCart.payload;
  await validatePayload(payload, listProduct1).then(async (data) => {
    payload = await validatePayload(data, listProduct2);
  });
  const newListProduct = await putTransfCart(idCartReceptor, payload);
  return newListProduct;
}

async function selectBtnCartProducts() {
  try {
    if (storeProducts != 0) {
      [bnUpdateAdd, btnUpdateDel, btnAllDel] = await crearHTMLProductsCarts();
      bnUpdateAdd.forEach((btnAdd) => {
        //ACTUALIZA SOLO LA CANTIDAD DEL PRODUCTO SELECCIONADO (SOLO AUMENTA)
        btnAdd.addEventListener("click", async (e) => {
          e.preventDefault();
          const idProduct = btnAdd.id;
          const productSelect = await getDataOneProductbyID(idProduct);
          const pStock = productSelect[0].stock;
          const optStock = await createListStock(pStock);
          Swal.fire({
            html: `How many ${productSelect[0].tittle} do you want to add to the cart?`,
            input: "select",
            inputOptions: optStock,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "YES",
            denyButtonText: "NOT",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const selectValue = Swal.getPopup().querySelector("select").value;
              const idCart = storeCarts[0]._id;
              const quantity = { stock: selectValue };
              validateStock(idProduct, +selectValue, 2);
              updateData(idCart, idProduct, quantity)
                .then(async (data) => {
                  if (data.status === 200) {
                    Swal.fire({
                      title: "Product(s) Added Successfully!!!",
                      text:
                        "Product Added>> " +
                        productSelect[0].tittle +
                        " -->Quantity: " +
                        selectValue,
                      icon: "success",
                      confirmButtonText: "Accept",
                    });
                    socket.emit("updateproduct", "Updated Products");
                    socket.emit(
                      "addingProductCart",
                      `Has been added ${selectValue} ${productSelect[0].tittle} al carrito.`
                    );
                  } else if (data.status === 401 || 403 || 404) {
                    console.warn("Client authorization expired or invalid");
                    Swal.fire(data.sessionData.error, "", "error");
                  }
                })
                .catch((error) => console.log("Error:" + error));
            } else if (result.isDenied) {
              Swal.fire("ACTION CANCELED", "", "info");
            }
          });
        });
      });
      btnUpdateDel.forEach((btnUpd) => {
        //ACTUALIZA SOLO LA CANTIDAD DEL PRODUCTO SELECCIONADO (SOLO DISMINUYE)
        btnUpd.addEventListener("click", async (e) => {
          e.preventDefault();
          storeCarts = await getDataCartsbyID(storeCarts[0]._id);
          let selectProduct;
          let products = storeCarts[0].products[0].payload;
          for (const listProduct of products) {
            let product = listProduct.product;
            product._id == btnUpd.id
              ? (selectProduct = listProduct)
              : (selectProduct = selectProduct);
          }
          const quantity = selectProduct.quantity;
          const idProduct = btnUpd.id;
          const optStock = await createListStock(quantity);
          Swal.fire({
            html: `How many ${selectProduct.product.tittle} do you want to delete to the cart?`,
            input: "select",
            inputOptions: optStock,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "YES",
            denyButtonText: "NOT",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const selectValue = Swal.getPopup().querySelector("select").value;
              const idCart = storeCarts[0]._id;
              const lastValue = Object.keys(optStock).pop();
              const quantity = { quantity: selectValue };
              validateStock(idProduct, +selectValue, 1);
              const action =
                lastValue == selectValue
                  ? deletedProductCart(idCart, idProduct)
                  : updateData(idCart, idProduct, quantity);
              action
                .then(async (data) => {
                  if (data.status === 200) {
                    Swal.fire({
                      title: "Product(s) Deleted Successfully!!!",
                      text:
                        "Product Deleted>> " +
                        selectProduct.product.tittle +
                        " -->Quantity: " +
                        selectValue,
                      icon: "success",
                      confirmButtonText: "Accept",
                    });
                    socket.emit("updateproduct", "Updated Products");
                    socket.emit(
                      "deletingProductCart",
                      `Has been removed ${selectValue} ${selectProduct.product.tittle} del carrito.`
                    );
                  } else if (data.status === 401 || 403 || 404) {
                    console.warn("Client authorization expired or invalid");
                    Swal.fire(data.sessionData.error, "", "error");
                  }
                })
                .catch((error) => console.log("Error:" + error));
            } else if (result.isDenied) {
              Swal.fire("ACTION CANCELED", "", "info");
            }
          });
        });
      });
      btnAllDel.forEach((btnDel) => {
        //ELIMINA DEL CARRITO EL PRODUCTO SELECCIONADO
        btnDel.addEventListener("click", async (e) => {
          e.preventDefault();
          storeCarts = await getDataCartsbyID(storeCarts[0]._id);
          let Product;
          let products = storeCarts[0].products[0].payload;
          for (const listProduct of products) {
            let product = listProduct.product;
            product._id == btnDel.id
              ? (Product = listProduct)
              : (Product = Product);
          }
          const quantity = Product.quantity;
          const idProduct = btnDel.id;
          const productSelect = await getDataOneProductbyID(idProduct);
          Swal.fire({
            html:
              `<h4>Are you sure to delete the product?<h4>` +
              `\n` +
              `<h6><b>(Remember that you will not be able to recover it!!!)<b><h6>`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "YES",
            denyButtonText: "NOT",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const idCart = storeCarts[0]._id;
              validateStock(idProduct, +quantity, 1);
              deletedProductCart(idCart, idProduct)
                .then(async (data) => {
                  if (data.status === 200) {
                    Swal.fire({
                      title: "Product Removed Successfully!!!",
                      text: "Product Removed>> " + "ID: " + idProduct,
                      icon: "success",
                      confirmButtonText: "Accept",
                    });
                    socket.emit("updateproduct", "Updated Products");
                    socket.emit(
                      "removeProduct",
                      `The Product ${productSelect[0].tittle} has been removed from cart`
                    );
                  } else if (data.status === 401 || 403 || 404) {
                    console.warn("Client authorization expired or invalid");
                    Swal.fire(data.sessionData.error, "", "error");
                  }
                })
                .catch((error) => console.log("Error:" + error));
            } else if (result.isDenied) {
              Swal.fire("ACTION CANCELED", "", "info");
            }
          });
        });
      });
    } else {
      btnAdd = await crearHTMLProductsCarts();
      btnAdd.addEventListener("click", () => {
        window.location.href = "../products";
      });
    }
  } catch (error) {
    console.log(error + ": No hay productos para remover del carrito");
  }
}

async function selectRemoveCart() {
  try {
    if (storeCarts != 0) {
      [btnRemoveCart, btnTransferCart] = await createHTMLCarts();
      btnRemoveCart.forEach((selectBtn) => {
        selectBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          const cardSelect = await getDataCartsbyID(selectBtn.id);
          Swal.fire({
            html:
              `<h4>Are you sure to delete the cart?<h4>` +
              `\n` +
              `<h6><b>(Remember that you will not be able to recover it!!!)<b><h6>`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "YES",
            denyButtonText: "NOT",
          }).then(async (result) => {
            if (result.isConfirmed) {
              await validateCartStock(cardSelect[0]._id);
              deleteCart(cardSelect[0]._id)
                .then(async (data) => {
                  if (data.status === 200) {
                    Swal.fire({
                      title: "Cart Removed Successfully!!!",
                      text: "Cart Removed>> " + "ID: " + cardSelect[0]._id,
                      icon: "success",
                      confirmButtonText: "Accept",
                    });
                    socket.emit("updateproduct", "Updated Products");
                    socket.emit(
                      "removeCart",
                      `Cart ${cardSelect[0]._id} Removed`
                    );
                  } else if (data.status === 401 || 403 || 404) {
                    console.warn("Client authorization expired or invalid");
                    Swal.fire(data.sessionData.error, "", "error");
                  }
                })
                .catch((error) => console.log("Error:" + error));
            } else if (result.isDenied) {
              Swal.fire("ACTION CANCELED", "", "info");
            }
          });
        });
      });
      btnTransferCart.forEach((selectBtn) => {
        selectBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          const btnTransfer = selectBtn.id;
          const optCarts = await createListCarts(btnTransfer);
          Swal.fire({
            text: "Which cart do you want to add products?",
            input: "select",
            inputOptions: optCarts,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "YES",
            denyButtonText: "NOT",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const numCart = Swal.getPopup().querySelector("select").value;
              const selectedCartId = ListCarts[numCart - 1];
              Swal.fire({
                html:
                  `<h4>Are you sure to transfer the cart?<h4>` +
                  `\n` +
                  `<h6><b>(Remember that the transferred cart will be deleted and cannot be recovered!!!)<b><h6>`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "YES",
                denyButtonText: "NOT",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  TransferCart(btnTransfer, selectedCartId)
                    .then(async (data) => {
                      if (data.status === 200) {
                        Swal.fire({
                          title: "Cart Transferred Successfully!!!",
                          text: "Cart Transferred>> " + "ID: " + btnTransfer,
                          icon: "success",
                          confirmButtonText: "Accept",
                        });
                        await deleteCart(btnTransfer);
                        socket.emit("updateproduct", "Updated Products");
                        socket.emit(
                          "transferCart",
                          `The cart ${btnTransfer} has been transferred to cart ${data.sessionData._id}`
                        );
                      } else if (data.status === 401 || 403 || 404) {
                        console.warn("Client authorization expired or invalid");
                        Swal.fire(data.sessionData.error, "", "error");
                      }
                    })
                    .catch((error) => console.log("Error:" + error));
                } else if (result.isDenied) {
                  Swal.fire("ACTION CANCELED", "", "info");
                }
              });
            } else if (result.isDenied) {
              Swal.fire("ACTION CANCELED", "", "info");
            }
          });
        });
      });
    } else {
      createHTMLCarts();
    }
  } catch (error) {
    console.log(error + ": There are no carts to be removed.");
  }
}

/*INICIO FUNCIONES CRUD*/
async function getDataCarts() {
  try {
    let response = await fetch(`${UrlC}`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    const data = await response.json();
    return data;
  } catch {
    console.log(Error);
  }
}

async function getDataCartsbyID(id) {
  let response = await fetch(`${UrlC}/${id}`, {
    method: "GET",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    mode: "cors",
  });
  const data = await response.json();
  return data;
}

async function getDataProductsbyID(id) {
  try {
    let response = await fetch(`${UrlC}/${id}`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    const data = await response.json();
    const dataProducts = data[0].products[0].payload;
    return dataProducts;
  } catch {
    console.log(Error);
  }
}

async function getDataOneProductbyID(id) {
  try {
    let response = await fetch(`${UrlP}/${id}`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    const data = await response.json();
    return data;
  } catch {
    console.log(Error);
  }
}

async function createCart(data) {
  try {
    const token = await getDataCookie("getTokenCookie");
    let response = await fetch(UrlC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    const dataRes = await response.json();
    return { status: response.status, sessionData: dataRes };
  } catch {
    console.log(Error);
  }
}

async function updateData(idCart, idProduct, data) {
  try {
    const token = await getDataCookie("getTokenCookie");
    let response = await fetch(`${UrlC}/${idCart}/products/${idProduct}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    const dataRes = await response.json();
    return { status: response.status, sessionData: dataRes };
  } catch {
    console.log(Error);
  }
}

async function updateOneProductbyID(idProduct, data) {
  try {
    const token = await getDataCookie("getTokenCookie");
    let response = await fetch(`${UrlP}/${idProduct}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    const dataRes = await response.json();
    return { status: response.status, sessionData: dataRes };
  } catch {
    console.log(Error);
  }
}

async function deletedProductCart(idCart, idProduct) {
  try {
    const token = await getDataCookie("getTokenCookie");
    let response = await fetch(`${UrlC}/${idCart}/products/${idProduct}`, {
      method: "DELETE",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    });
    const dataRes = await response.json();
    return { status: response.status, sessionData: dataRes };
  } catch {
    console.log(Error);
  }
}

async function deleteAllProductsCart(idCart) {
  try {
    const token = await getDataCookie("getTokenCookie");
    let response = await fetch(`${UrlC}/${idCart}`, {
      method: "DELETE",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    });
    const dataRes = await response.json();
    return { status: response.status, sessionData: dataRes };
  } catch {
    console.log(Error);
  }
}

async function putTransfCart(idCart, data) {
  try {
    const token = await getDataCookie("getTokenCookie");
    let response = await fetch(`${UrlC}/${idCart}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    const dataRes = await response.json();
    return { status: response.status, sessionData: dataRes };
  } catch {
    console.log(Error);
  }
}

async function deleteCart(idCart) {
  try {
    const token = await getDataCookie("getTokenCookie");
    let response = await fetch(`${UrlC}/${idCart}/delete`, {
      method: "DELETE",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    });
    const dataRes = await response.json();
    return { status: response.status, sessionData: dataRes };
  } catch {
    console.log(Error);
  }
}
/*FIN FUNCIONES CRUD*/

async function getDataCookie(name) {
  try {
    let response = await fetch(UrlCook + name, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    if (response.status == 400) {
      console.warn("Client authorization expired or invalid");
      return;
    } else if (response.status == 200) {
      return response.json();
    }
  } catch {
    console.log(Error);
  }
}

/*****************************************************************SOCKETS*************************************************************/

socket.on("callCarts", async (getCarts) => {
  Object.assign(storeCarts, getCarts);
  if (storeCarts.length == 1) {
    if (RouteIndex === "cartP") {
      storeCarts = await getDataCarts();
      storeProducts = [];
      selectRemoveCart();
    } else if (RouteIndex === "cartP/") {
      sessionStorage.setItem("cartView", storeCarts[0]._id);
      storeProducts = await getDataProductsbyID(storeCarts[0]._id);
      selectBtnCartProducts();
    }
  } else if (storeCarts.length != 1) {
    if (RouteIndex === "cartP/") {
      let idCart = sessionStorage.getItem("cartView");
      storeProducts = await getDataProductsbyID(idCart);
      selectBtnCartProducts();
    } else if (RouteIndex === "cartP") {
      storeCarts = await getDataCarts();
      storeProducts = [];
      selectRemoveCart();
    }
  }
  focusAction();
});

socket.on("addingProductCart", async (msj) => {
  console.log(msj);
  selectAction();
});

socket.on("deleteofcart", async (msj) => {
  console.log(msj);
  selectAction();
});

socket.on("deletingProductCart", async (msj) => {
  console.log(msj);
  selectAction();
});

socket.on("removeProduct", async (msj) => {
  console.log(msj);
  selectAction();
});

socket.on("emptyCart", async (msj) => {
  console.log(msj);
  selectAction();
});

socket.on("removeCart", async (msj) => {
  console.log(msj);
  selectAction();
});

socket.on("NewCart", async (msj) => {
  console.log(msj);
  selectAction();
});

socket.on("transferCart", async (msj) => {
  console.log(msj);
  selectAction();
});

socket.on("viewingCart", async (id) => {
  if (RouteIndex === "cartP") {
    let int = -1;
    let btnTransferCart = [];
    let btnRemoveCart = [];
    selectRemoveCart();
    btnTransferCart = document.querySelectorAll(".btnTransferCart");
    btnRemoveCart = document.querySelectorAll(".btnRemoveCart");
    for (const cart of storeCarts) {
      int++;
      if (cart._id == id) {
        btnTransferCart[int].classList.add("hidden");
        btnRemoveCart[int].classList.add("hidden");
      }
    }
  }
});

socket.on("viewingCloseCart", async (id) => {
  if (RouteIndex === "cartP") {
    let int = -1;
    let btnTransferCart = [];
    let btnRemoveCart = [];
    selectRemoveCart();
    btnTransferCart = document.querySelectorAll(".btnTransferCart");
    btnRemoveCart = document.querySelectorAll(".btnRemoveCart");
    for (const cart of storeCarts) {
      int++;
      if (cart._id == id) {
        btnTransferCart[int].classList.remove("hidden");
        btnRemoveCart[int].classList.remove("hidden");
      }
    }
  }
});

/*****************************************************************EVENTS*************************************************************/

btnAddNewCart.addEventListener("click", () => {
  Swal.fire({
    title: "YOU WANT ADD NEW CART?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "YES",
    denyButtonText: "NOT",
  }).then((result) => {
    if (result.isConfirmed) {
      const cart = new NewCart();
      createCart(cart)
        .then(async (data) => {
          if (data.status === 200) {
            Swal.fire({
              title: "Cart Created Successfully!!!",
              text: "Cart created>> " + "ID: " + data.sessionData._id,
              icon: "success",
              confirmButtonText: "Accept",
            });
            socket.emit("NewCart", `New cart ${data.sessionData._id} create`);
          } else if (data.status === 401 || 403 || 404) {
            console.warn("Client authorization expired or invalid");
            Swal.fire(data.sessionData.error, "", "error");
          }
        })
        .catch((error) => console.log("Error:" + error));
    } else if (result.isDenied) {
      Swal.fire("ACTION CANCELED", "", "info");
    }
  });
});

btnClearCart.addEventListener("click", () => {
  Swal.fire({
    html:
      `<h4>Are you sure to empty the cart??<h4>` +
      `\n` +
      `<h6><b>(Remember that you will not be able to recover it!!!)<b><h6>`,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "YES",
    denyButtonText: "NOT",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let idCart = storeCarts[0]._id;
      await validateCartStock(idCart);
      deleteAllProductsCart(idCart)
        .then(async (data) => {
          if (data.status === 200) {
            Swal.fire({
              title: "All Products Cart Removed Successfully!!!",
              text: "Cart Clean>> " + "ID: " + idCart,
              icon: "success",
              confirmButtonText: "Accept",
            });
            socket.emit("emptyCart", `Cart ${idCart} emptying`);
          } else if (data.status === 401 || 403 || 404) {
            console.warn("Client authorization expired or invalid");
            Swal.fire(data.sessionData.error, "", "error");
          }
        })
        .catch((error) => console.log("Error:" + error));
    } else if (result.isDenied) {
      Swal.fire("ACTION CANCELED", "", "info");
    }
  });
});

btnExitCart.onclick = () => {
  const idCart = sessionStorage.getItem("cartView");
  socket.emit("viewingCloseCart", idCart);
  window.location.href = "../cart";
};
