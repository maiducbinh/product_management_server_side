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