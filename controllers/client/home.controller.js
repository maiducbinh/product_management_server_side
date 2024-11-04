const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active",
    });
    // Hết Lấy ra sản phẩm nổi bật
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

    // Hiển thị danh sách sản phẩm mới nhất
    const productsNew = await Product.find({
            deleted: false,
            status: "active",
        })
        .sort({
            position: "desc"
        })
        .limit(6);
    // Hết Hiển thị danh sách sản phẩm mới nhất
    const newProductsNew = productsHelper.priceNewProducts(productsNew);
    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew,
    });
};