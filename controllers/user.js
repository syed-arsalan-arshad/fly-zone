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
      });
    }
    res.render("user/login-otp", {
      pageTitle: "Login",
      menuList: cat,
      otp: otp,
      mobileNo: mobile,
      errorMessage:
        "One Time Password(OTP) is sent to your mobile no " + mobile,
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
    req.session.userData = user;
    req.session.isUserLoggedIn = true;
    if(req.session.url){
      res.redirect(req.session.url);
    }else{
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
  if(!req.session.isUserLoggedIn){
    req.session.url = req.protocol + '://' + req.get('host') + req.originalUrl;
  }
  let isProdInCart = false;
  try {
    if(req.session.isUserLoggedIn){
      const prodInCart = await Cart.findAll({where: {userId: req.session.userData.id, productId: proId}});
      if(prodInCart.length >= 1){
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
      isProdInCart: isProdInCart
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = (req, res, next) => {
  let userCat;
  // let finalCat = [];
  Category.findAll({ include: SubCategory })
    .then((cat) => {
      userCat = cat;
      // console.log(userCat);
      return Product.findAll();
      // return SubCategory.findAll();
    })
    .then((products) => {
      res.render("user/index", {
        pageTitle: "Home | Fly-Zone",
        menuList: userCat,
        products: products,
      });
    })
    // .then(subCat => {
    //     finalCat = userCat.map(cat => {
    //         // console.log(cat);
    //         // let d = [];
    //         // subCat.forEach(subcat => {
    //         //     if(cat.id == subcat.categoryId){
    //         //         d.push(subcat);
    //         //     }
    //         // });
    //         // // console.log(cat);
    //         // return {CatData: cat, SubCat: d};
    //     });

    // })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAboutUs = (req, res, next) => {
  Category.findAll({ include: SubCategory })
    .then((cat) => {
      res.render("user/about-us", {
        pageTitle: "About Us | Fly-Zone",
        menuList: cat,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getContactUs = (req, res, next) => {
  Category.findAll({ include: SubCategory })
    .then((cat) => {
      res.render("user/contact-us", {
        pageTitle: "Contact Us | Fly-Zone",
        menuList: cat,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCatalog = (req, res, next) => {
  Category.findAll({ include: SubCategory })
    .then((cat) => {
      res.render("user/catalog", {
        pageTitle: "Catalog | Fly-Zone",
        menuList: cat,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCategoryWiseProduct = (req, res, next) => {
  const catId = req.params.catId;
};

exports.getSingleProduct = (req, res, next) => {
  Category.findAll({ include: SubCategory })
    .then((cat) => {
      res.render("user/single-product", {
        pageTitle: "Single | Fly-Zone",
        menuList: cat,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Category.findAll({ include: SubCategory })
    .then((cat) => {
      res.render("user/cart", {
        pageTitle: "Cart | Fly-Zone",
        menuList: cat,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addToCart = (req, res, next) => {
  const proId = req.body.proId;
  const quantity = req.body.quantity;
  Cart.create({
    productId: proId,
    userId: req.session.userData.id,
    quantity: quantity
  })
  .then(cart => {
    console.log(cart);
    
  })
  .catch(err => {
    console.log(err);
  })
};