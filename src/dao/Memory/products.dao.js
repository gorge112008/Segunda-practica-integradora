export default class ProductsDao {
  constructor() {
    this.data = { payload: [] };
  }
  async getProducts() {
    return this.data.payload;
  }
  async addProduct(newProduct) {}
  async getProductId(id) {}
  async addProduct(newProduct) {}
  async updateProduct(id, body) {}
  async deleteProduct(id) {}
}
