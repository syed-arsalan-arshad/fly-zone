const { validationResult } = require("express-validator/check");
const Category = require("../models/category");
const Seller = require("../models/seller");
const SubCategory = require("../models/sub-category");
const Product = require("../models/product");
exports.getIndex = (req, res, next) => {
  res.render("seller/index", {
    path: "/",
    sidePath: "/",
  });
};

exports.getRegistration = (req, res, next) => {
  res.render("seller/registration", {
    path: "/login",
    successMessage: "",
    errorMessage: "",
    oldData: {
      name: "",
      email: "",
      mobile: "",
      shopName: "",
      password: "",
      confirm_password: "",
    },
  });
};

exports.postRegistration = async (req, res, next) => {
  const errors = validationResult(req);
  const name = req.body.name;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const shopName = req.body.shopName;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const shopLogo = req.files[0];
  const docs = req.files[1];

  if (!errors.isEmpty()) {
    return res.render("seller/registration", {
      path: "/login",
      successMessage: "",
      errorMessage: errors.array()[0].msg,
      oldData: {
        name: name,
        email: email,
        mobile: mobile,
        shopName: shopName,
        password: password,
        confirm_password: confirm_password,
      },
    });
  }
  if (!shopLogo || !docs) {
    return res.render("seller/registration", {
      path: "/login",
      successMessage: "",
      errorMessage: "Please Upload Correct File",
      oldData: {
        name: name,
        email: email,
        mobile: mobile,
        shopName: shopName,
        password: password,
        confirm_password: confirm_password,
      },
    });
  }
  if (password !== confirm_password) {
    return res.render("seller/registration", {
      path: "/login",
      successMessage: "",
      errorMessage: "Both Password Should Be Match",
      oldData: {
        name: name,
        email: email,
        mobile: mobile,
        shopName: shopName,
        password: password,
        confirm_password: confirm_password,
      },
    });
  }
  try {
    let seller = await Seller.findAll({ where: { mobile: mobile } });
    if (seller.length != 0) {
      console.log(seller);
      return res.render("seller/registration", {
        path: "/login",
        successMessage: "",
        errorMessage: "Seller With This Mobile Number Is Already Registered",
        oldData: {
          name: name,
          email: email,
          mobile: mobile,
          shopName: shopName,
          password: password,
          confirm_password: confirm_password,
        },
      });
    } else {
      seller = await Seller.create({
        name: name,
        shopName: shopName,
        email: email,
        mobile: mobile,
        password: password,
        shopLogo: shopLogo.path,
        docs: docs.path,
        status: 0,
      });
      return res.render("seller/registration", {
        path: "/login",
        errorMessage: "",
        successMessage:
          "You Applied For Registration For Becoming Seller @ Fly-Zone. Our Fly-Zone Team Will Reach You Shortly",
        oldData: {
          name: "",
          email: "",
          mobile: "",
          shopName: "",
          password: "",
          confirm_password: "",
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getLogin = (req, res, next) => {
  res.render("seller/login", {
    path: "/login",
    errorMessage: "",
  });
};

exports.postLogin = async (req, res, next) => {
  const errors = validationResult(req);
  const mobile = req.body.mobile;
  const password = req.body.password;
  if (!errors.isEmpty()) {
    return res.render("seller/login", {
      path: "/login",
      errorMessage: errors.array()[0].msg,
    });
  }
  try {
    const seller = await Seller.findAll({ where: { mobile: mobile } });
    if (seller.length > 0) {
      console.log(seller);
      if (password == seller[0].password) {
        if (seller[0].status == 1) {
          req.session.isSellerLoggedIn = true;
          req.session.sellerData = seller[0];
          res.redirect("/seller");
        } else {
          return res.render("seller/login", {
            path: "/login",
            errorMessage: "Your Seller Account Is Not Verified By Admin",
          });
        }
      } else {
        return res.render("seller/login", {
          path: "/login",
          errorMessage: "Password Did't Match",
        });
      }
    } else {
      return res.render("seller/login", {
        path: "/login",
        errorMessage: "No Record Available With This Mobile No",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.logout = (req, res, next) => {
  req.session.isSellerLoggedIn = false;
  res.redirect("/seller");
};

exports.getAddProduct = async (req, res, next) => {
  // console.log(req.session.sellerData);
  const cat = await Category.findAll({ include: SubCategory });
  // console.log(cat[0].subCategories);
  const subcat = await SubCategory.findAll({ include: Category });
  res.render("seller/add-product", {
    path: "",
    sidePath: "/add-product",
    errorMessage: "",
    cat: cat,
    subcat: subcat,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const error = validationResult(req);
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const catId = req.body.category;
  const subcatId = req.body.subcategory;
  const mainImage = req.files[0].path;
  const smallFront = req.files[1].path;
  const smallBack = req.files[2].path;
  // console.log(imageUrl);

  try {
    const cat = await Category.findAll();
    const subcat = await SubCategory.findAll({ include: Category });
    if (!error.isEmpty()) {
      return res.render("seller/add-product", {
        path: "",
        sidePath: "/add-product",
        cat: cat,
        subcat: subcat,
        errorMessage: error.array()[0].msg,
      });
    }
    if (!mainImage || !smallFront || !smallBack) {
      return res.render("seller/add-product", {
        path: "",
        sidePath: "/add-product",
        cat: cat,
        subcat: subcat,
        errorMessage: error.array()[0].msg,
      });
    }
    const category = await Category.findByPk(catId);
    const subcategory = await SubCategory.findByPk(subcatId);
    // console.log(category.id);
    await Product.create({
      title: title,
      mainImage: mainImage,
      smallFront: smallFront,
      smallBack: smallBack,
      description: description,
      price: price,
      categoryId: category.id,
      subCategoryId: subcategory.id,
      sellerId: req.session.sellerData.id,
    });
    res.redirect("/seller/view-product");
  } catch (err) {
    console.log(err);
  }
};

exports.getViewProduct = (req, res, next) => {
  Product.findAll({ include: [Seller, Category, SubCategory] })
    .then((products) => {
      console.log(products);
      res.render("seller/view-product", {
        path: "",
        sidePath: "/view-product",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.productDetails = (req, res, next) => {
  res.render("seller/product-details", {
    path: "",
    sidePath: "/view-product",
  });
};
