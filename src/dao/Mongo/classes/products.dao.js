import { productsModel } from "../models/products.model.js";

export default class ProductDao {
  async getProducts({ limit, page, sort, query }) {
    try {
      let products;
      products = await productsModel.paginate(query, { limit, page, sort });
      return products;
    } catch (err) {
      throw err;
    }
  }
  async getProductId(id) {
    try {
      const newProduct = [];
      const product = await productsModel.findOne({ _id: id });
      newProduct.push(product);
      return newProduct;
    } catch (err) {
      throw err;
    }
  }

  async addProduct(newProduct) {
    try {
      const product = await productsModel.create(newProduct);
      return product;
    } catch (err) {
      throw err;
    }
  }
  async updateProduct(id, body) {
    try {
      const product = await productsModel.findOneAndUpdate({ _id: id }, body, {
        new: true,
        upsert: true,
      });
      return product;
    } catch (err) {
      throw err;
    }
  }

  async deleteProduct(id) {
    try {
      await productsModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw err;
    }
  }
}
