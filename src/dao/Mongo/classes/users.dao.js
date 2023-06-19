import { userModel } from "../models/users.model.js";

export default class UserDao {
  async getUsers() {
    try {
      const Users = await userModel.find();
      return Users;
    } catch (err) {
      throw err;
    }
  }

  async getUserUnique(query) {
    try {
      const User = await userModel.findOne(query);
      return User;
    } catch (err) {
      throw err;
    }
  }

  async getUserId(id) {
    try {
      const User = await userModel.findOne({ _id: id }).populate("cart");
      return User;
    } catch (err) {
      throw err;
    }
  }
  async getUserbyEmail(email) {
    try {
      const User = await userModel.findOne({ email: email });
      return User;
    } catch (err) {
      throw err;
    }
  }
  async addUser(newUser) {
    try {
      const response = await userModel.create(newUser);
      return response;
    } catch (err) {
      throw err;
    }
  }
  async updateUser(email, body) {
    try {
      const User = await userModel.findOneAndUpdate({ email: email }, body, {
        new: true,
        upsert: true,
      });
      return User;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id) {
    try {
      await userModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw err;
    }
  }
}
