const Category = require("../models/category");
const Product = require("../models/product");
const SubCategory = require("../models/sub-category");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const Seller = require("../models/seller");
const ProductLabel = require("../models/productLabel");
const Cart = require("../models/cart");

exports.getLogin = (req, res, next) => {
  Category.findAll({ include: SubCategory })
    .then((cat) => {
      console.log("Login");
      res.render("user/login", {
        pageTitle: "Login",
        menuList: cat,
        errorMessage: "",
        cartCount: req.session.userCart
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.sendOTP = async (req, res, next) => {
  const errors = validationResult(req);
  const mobile = req.body.mobileNo;
  const otp = 123456;
  try {
    console.log("otp");
    const cat = await Category.findAll({ include: SubCategory });
    if (!errors.isEmpty()) {
      return res.render("user/login", {
        pageTitle: "Login",
        menuList: cat,
        errorMessage: errors.array()[0].msg,
        cartCount: req.session.userCart
      });
    }
    res.render("user/login-otp", {
      pageTitle: "Login",
      menuList: cat,
      otp: otp,
      mobileNo: mobile,
      errorMessage:
        "One Time Password(OTP) is sent to your mobile no " + mobile,
      cartCount: req.session.userCart
    });
  } catch (err) {
    console.log(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  const oldOTP = req.body.oldOTP;
  const newOTP = req.body.newOTP;
  const mobileNo = req.body.mobileNo;

  try {
    const cat = await Category.findAll({ include: SubCategory });
    if (newOTP !== oldOTP) {
      return res.render("user/login-otp", {
        pageTitle: "Login",
        menuList: cat,
        otp: oldOTP,
        mobileNo: mobileNo,
        errorMessage: "OTP did not match",
        cartCount: req.session.userCart
      });
    }
    let userCount = await User.findAndCountAll({ where: { mobile: mobileNo } });
    let user = await User.findAll({ where: { mobile: mobileNo } });
    if (userCount.count == 0) {
      user = await User.create({ mobile: mobileNo, status: 1 });
    } else {
      user = user[0];
    }
    // console.log(user);
    const cartCount = await Cart.findAndCountAll({
      where: { userId: user.id },
    });
    // console.log(cartCount);
    user.cartCount = cartCount.count;
    req.session.userCart = cartCount.count;
    req.session.userData = user;
    req.session.isUserLoggedIn = true;
    if (req.session.url) {
      const url = req.session.url;
      req.session.url = "";
      res.redirect(url);
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.userLogout = (req, res, next) => {
  req.session.isUserLoggedIn = false;
  res.redirect("/");
};

exports.userProfile = async (req, res, next) => {
  const userData = req.session.userData;

  try {
    const menuList = await Category.findAll({ include: SubCategory });
    res.render("user/profile", {
      pageTitle: "User Profile",
      userData: userData,
      menuList: menuList,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateProfile = (req, res, next) => {
  res.render("user/update-profile");
};

exports.postUpdateProfile = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const mobile = req.session.userData.mobile;
  User.update(
    {
      name: name,
      email: email,
    },
    {
      where: {
        mobile: mobile,
      },
    }
  )
    .then((user) => {
      if (user) {
        return User.findAll({ where: { mobile: mobile } });
      }
    })
    .then((userData) => {
      // console.log(userData);
      req.session.userData = userData[0];
      res.redirect("/user-profile");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductDetails = async (req, res, next) => {
  // console.log(req.session.userData);
  const proId = req.params.proId;
  if (!req.session.isUserLoggedIn) {
    req.session.url = req.protocol + "://" + req.get("host") + req.originalUrl;
  }
  let cartCount = 0;
  if (req.session.isUserLoggedIn) {
    cartCount = req.session.userCart;
  }
  let isProdInCart = false;
  try {
    if (req.session.isUserLoggedIn) {
      const prodInCart = await Cart.findAll({
        where: { userId: req.session.userData.id, productId: proId },
      });
      if (prodInCart.length >= 1) {
        isProdInCart = true;
      }
    }
    const product = await Product.findByPk(proId, {
      include: [Seller, ProductLabel],
    });
    const menuList = await Category.findAll({ include: SubCategory });
    // console.log(product);
    res.render("user/single-product", {
      pageTitle: product.title,
      product: product,
      menuList: menuList,
      isProdInCart: isProdInCart,
      cartCount: cartCount,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    let cartCount = 0;
    if (req.session.isUserLoggedIn) {
      cartCount = req.session.userCart;
    }
    const cat = await Category.findAll({ include: SubCategory });
    const products = await Product.findAll();
    res.render("user/index", {
      pageTitle: "Home | Fly-Zone",
      menuList: cat,
      products: products,
      cartCount: cartCount,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAboutUs = (req, res, next) => {
  let cartCount = 0;
  if (req.session.isUserLoggedIn) {
    cartCount = req.session.userCart;
  }
  Category.findAll({ include: SubCategory })
    .then((cat) => {
      res.render("user/about-us", {
        pageTitle: "About Us | Fly-Zone",
        menuList: cat,
        cartCount: cartCount,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getContactUs = (req, res, next) => {
  let cartCount = 0;
  if (req.session.isUserLoggedIn) {
    cartCount = req.session.userCart;
  }
  Category.findAll({ include: SubCategory })
    .then((cat) => {
      res.render("user/contact-us", {
        pageTitle: "Contact Us | Fly-Zone",
        menuList: cat,
        cartCount: cartCount,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCatalog = (req, res, next) => {
  let cartCount = 0;
  if (req.session.isUserLoggedIn) {
    cartCount = req.session.userCart;
  }
  Category.findAll({ include: SubCategory })
    .then((cat) => {
      res.render("user/catalog", {
        pageTitle: "Catalog | Fly-Zone",
        menuList: cat,
        cartCount: cartCount,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCategoryWiseProduct = async (req, res, next) => {
  const catId = req.params.catId;
  let cartCount = 0;
  try{ 
    const categoryData = await Category.findByPk(catId);
    const product = await Product.findAll({where: {categoryId: catId}});
    const cat = await Category.findAll({ include: SubCategory });
    if(req.session.isUserLoggedIn){
      cartCount = Cart.findAndCountAll({where: {userId: req.session.userData.id}}).count;
    }

    res.render("user/catalog", {
      pageTitle: categoryData.cat_name,
      menuList: cat,
      cartCount: cartCount,
      product: product
    });

  }catch(err){
    console.log(err);
  }

};

exports.getSubCategoryWiseProduct = async (req, res, next) => {
  const subCatId = req.params.subId;
  let cartCount = 0;
  try{ 
    const subCategoryData = await SubCategory.findByPk(subCatId, {include: Category});
    const product = await Product.findAll({where: {subCategoryId: subCatId}});
    const cat = await Category.findAll({ include: SubCategory });
    if(req.session.isUserLoggedIn){
      cartCount = Cart.findAndCountAll({where: {userId: req.session.userData.id}}).count;
    }

    res.render("user/sub-catalog", {
      pageTitle: subCategoryData,
      menuList: cat,
      cartCount: cartCount,
      product: product
    });

  }catch(err){
    console.log(err);
  }

};

// exports.getSingleProduct = (req, res, next) => {
//   Category.findAll({ include: SubCategory })
//     .then((cat) => {
//       res.render("user/single-product", {
//         pageTitle: "Single | Fly-Zone",
//         menuList: cat,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

exports.getCart = async (req, res, next) => {
  let cartCount = 0;
  if (req.session.isUserLoggedIn) {
    cartCount = req.session.userCart;
  }
  try {
    const cat = await Category.findAll({ include: SubCategory });
    const cartProd = await Cart.findAll({include: Product}, {where: {userId: req.session.userData.is}});
    //console.log(cartProd);
    res.render("user/cart", {
      pageTitle: "Cart | Fly-Zone",
      menuList: cat,
      cartCount: cartCount,
      cartProd: cartProd
    });
  } catch (err) {
    console.log(err);
  }
};

exports.addToCart = (req, res, next) => {
  const proId = req.body.proId;
  const quantity = req.body.quantity;
  Cart.create({
    productId: proId,
    userId: req.session.userData.id,
    quantity: quantity,
  })
    .then((cart) => {
      return Cart.findAndCountAll({
        where: { userId: req.session.userData.id },
      });
    })
    .then((cartCount) => {
      req.session.userCart = cartCount.count;
      console.log(req.session.userCart);
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};


