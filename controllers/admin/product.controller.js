const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")
const ProductCategory = require("../../models/product-category.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper({
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    );

    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    // End Sort

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}


module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({
        _id: id
    }, {
        status: status
    });
    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect("back");
};

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active"
            });
            req.flash("success", `Cập nhật trạng thái thành công cho ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive"
            });
            req.flash("success", `Cập nhật trạng thái thành công cho ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                // console.log(id);
                // console.log(position);
                await Product.updateOne({
                    _id: id
                }, {
                    position: position
                });
            }
            req.flash("success", `Cập nhật trạng thái thành công cho ${ids.length} sản phẩm!`);
            break;
        default:
            break;
    }
    res.redirect("back");
};

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({
    //     _id: id
    // });
    await Product.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `Xóa thành công sản phẩm!`);
    res.redirect("back");
};

module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };
    const category = await ProductCategory.find();
    
    const newCategory = createTreeHelper.tree(category);    
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory
    });
};

module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position === "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
};


module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);
        console.log(product);
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        });
    } catch (err) {
        req.flash("error", "Không tìm thấy sản phẩm!");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    try {
        await Product.updateOne({
            _id: id
        }, req.body);
        req.flash("success", "Cập nhật sản phẩm thành công!");
    } catch (err) {
        req.flash("error", "Không tìm thấy sản phẩm!");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
    res.redirect("back");
};

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);
        console.log(product);
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (err) {
        req.flash("error", "Không tìm thấy sản phẩm!");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};