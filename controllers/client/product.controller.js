const { status } = require("express/lib/response");
const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position:"asc"});
    products.forEach(item => {
        item.priceNew = (item.price* (100 - item.discountPercentage)/100).toFixed(0);
    });
    
    res.render("client/pages/products/index.pug", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products
    }); 
}

module.exports.detail = async (req, res) => {
    try {
      const find = {
        deleted: false,
        slug: req.params.slug,
        status: "active"
      };
  
      const product = await Product.findOne(find);
  
      console.log(product);
  
      res.render("client/pages/products/detail", {
        pageTitle: product.title,
        product: product,
      });
    } catch (error) {
      res.redirect("/products");
    }
  };
  