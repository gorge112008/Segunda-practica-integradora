import { Server } from "socket.io";
import {
  publicProducts,
  publicMessages,
  publicCarts,
} from "./controllers/publicController.js";

import {
  privateProducts,
} from "./controllers/privateController.js";

async function initSocketServer(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.emit("backMessages", publicMessages)
    socket.emit("callProductsPublic", publicProducts); 
    socket.emit("callProductsPrivate", privateProducts); 
    socket.emit("callCarts", publicCarts);

    socket.on("addproduct", async (newProduct) => {
      socket.broadcast.emit("f5NewProduct", newProduct);
    });

    socket.on("deleteproduct", async (idproduct) => {
      io.emit("f5deleteProduct", idproduct);
    });

    socket.on("deleteofcart", async (msj) => {
      io.emit("deleteofcart", msj);
    });

    socket.on("updateproduct", async (product) => {
      io.emit("f5updateProduct", product);
    });

    socket.on("updatingProduct", async (msj) => {
      io.emit("updatingProduct", msj);
    });

    socket.on("viewingProduct", async (id) => {
      io.emit("viewingProduct", id);
    });
    socket.on("viewingCloseProduct", async (id) => {
      socket.broadcast.emit("viewingCloseProduct", id);
    });

    socket.on("viewingCart", async (id) => {
      io.emit("viewingCart", id);
    });

    socket.on("viewingCloseCart", async (id) => {
      socket.broadcast.emit("viewingCloseCart", id);
    });

    socket.on("addingProductCart", async (msj) => {
      io.emit("addingProductCart", msj);
    });

    socket.on("deletingProductCart", async (msj) => {
      io.emit("deletingProductCart", msj);
    });

    socket.on("removeProduct", async (msj) => {
      io.emit("removeProduct", msj);
    });

    socket.on("emptyCart", async (msj) => {
      io.emit("emptyCart", msj);
    });

    socket.on("removeCart", async (msj) => {
      io.emit("removeCart", msj);
    });

    socket.on("NewCart", async (msj) => {
      io.emit("NewCart", msj);
    });

    socket.on("transferCart", async (msj) => {
      io.emit("transferCart", msj);
    });

    socket.on("exonerateStatus", async (msj) => {
      console.log("Issuance of Order of Exoneration");
      socket.broadcast.emit("orderExonerate", msj);
    });

    socket.on("responseExonerate", async (id) => {
      console.log("Exemption Order Response");
      socket.broadcast.emit("idExonerate", id);
    });

    socket.on("validateStatus", async (productsValid) => {
      io.emit("actualize", productsValid);
    });

    socket.on("finExo", async (msj) => {
      io.emit("finValidate", msj);
    });

    socket.on("newUser", (data) => {
      socket.user = data.user;
      socket.id = data.id;
      io.emit("newUser-connected", {
        user: socket.user,
        id: socket.id,
      });
    });

    socket.on("newMessage", async (lastMessage) => {
      io.emit("messageLogs", lastMessage);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

export default initSocketServer;
