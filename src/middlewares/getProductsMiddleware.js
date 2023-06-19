//import { ProductDAO } from "../dao/Mongo/classes/DBmanager.js";
import { ProductDAO } from "../dao/index.js";

class ListProducts {
  constructor(
    limit,
    sort,
    listQuery,
    payload,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage
  ) {
    this.status = "success";
    this.payload = payload;
    this.totalPages = totalPages || 1;
    this.prevPage = prevPage;
    this.nextPage = nextPage;
    this.page = page || 1;
    this.hasPrevPage = hasPrevPage || false;
    this.hasNextPage = hasNextPage || false;
    hasPrevPage
      ? (this.prevLink = `/api/products?limit=${limit}${
          sort ? `&sort=${sort}` : ``
        }&page=${prevPage}${listQuery}`)
      : null;
    hasNextPage
      ? (this.nexLink = `/api/products?limit=${limit}${
          sort ? `&sort=${sort}` : ``
        }&page=${nextPage}${listQuery}`)
      : null;
  }
}

const middlewareGetProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Valor predeterminado de 10
    const page = parseInt(req.query.page) || 1; // Valor predeterminado de 1
    const reqSort = req.query.sort; // Valor predeterminado de undefined
    const sort = {};
    if (reqSort === "asc") {
      sort.price = 1;
    } else if (reqSort === "desc") {
      sort.price = -1;
    }
    const reqQuery = req.query || "";
    let query = {};
    if (reqQuery !== "") {
      const { limit, page, sort, ...rest } = reqQuery;
      query = { ...rest };
    } else {
      query = {};
    }
    let listQuery = "";
    for (const key in query) {
      if (Object.hasOwnProperty.call(query, key)) {
        const value = query[key];
        listQuery += `&${key}=${value}`;
      }
    }
    const products = await ProductDAO.getProducts({
      limit,
      page,
      sort,
      query,
    });
    const resProducts = new ListProducts(
      limit,
      reqSort,
      listQuery,
      products.docs||products,
      products.totalPages,
      products.prevPage,
      products.nextPage,
      products.page,
      products.hasPrevPage,
      products.hasNextPage,
      products.prevLink,
      products.nexLink
    );
    res.locals.products = resProducts;
    next();
  } catch (error) {
    next(error);
  }
};

export default middlewareGetProducts;
