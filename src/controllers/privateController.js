let privateProducts;

const privateController = {
  realtimeproducts: (req, res) => {
    const { role, email } = req.user.user;
    privateProducts = res.locals.resProducts;
    res.render("private/realtimeproducts", {
      role: role,
      user: email,
      body: privateProducts,
    });
  },
};

export default privateController;
export { privateProducts };
