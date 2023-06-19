// MEMORY PERSISTENCE
import memoryProductsDao from "./Memory/products.dao.js";
//MONGO PERSISTENCE
import mongoCartsDao from "./Mongo/classes/carts.dao.js";
import mongoMessagesDao from "./Mongo/classes/messages.dao.js";
import mongoProductsDao from "./Mongo/classes/products.dao.js";
import mongoUsersDao from "./Mongo/classes/users.dao.js";

import { PERSISTENCE } from "../config/config.js";

//MEMORY PERSISTENCE
const MemoryProductDao = new memoryProductsDao();
//MONGO PERSISTENCE
const MongoCartDao = new mongoCartsDao();
const MongoMessageDao = new mongoMessagesDao();
const MongoProductDao = new mongoProductsDao();
const MongoUserDao = new mongoUsersDao();

export const CartDAO = MongoCartDao;
export const MessageDAO = MongoMessageDao;
export const UserDAO = MongoUserDao;
export const ProductDAO =
  PERSISTENCE === "MEMORY" ? MemoryProductDao : MongoProductDao;
