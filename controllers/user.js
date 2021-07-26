const Category = require("../models/category");
const Product = require("../models/product");
const SubCategory = require("../models/sub-category");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const Seller = require("../models/seller");
const ProductLabel = require("../models/productLabel");
const Cart = require("../models/cart");
const UserAddress = require("../models/user-address");
const Orders = require("../models/orders");
const OrderList = require("../models/order-list");
const orderid = require("order-id")("mysecret");

exports.getLogin = (req, res, next) => {
  Category.findAll({ include: SubCategory })
    .then((cat) => {
      console.log("Login");
      res.render("user/login", {
        pageTitle: "Login",
        menuList: cat,
        errorMessage: "",
        cartCount: "",
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
        cartCount: "",
      });
    }
    res.render("user/login-otp", {
      pageTitle: "Login",
      menuList: cat,
      otp: otp,
      mobileNo: mobile,
      errorMessage:
        "One Time Password(OTP) is sent to your mobile no " + mobile,
      cartCount: "",
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
        cartCount: "",
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
    const cartCount = await Cart.findAndCountAll({
      where: { userId: req.session.userData.id },
    });
    const latestOrder = await Orders.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });
    const menuList = await Category.findAll({ include: SubCategory });
    res.render("user/profile", {
      pageTitle: "User Profile",
      userData: userData,
      menuList: menuList,
      cartCount: cartCount.count,
      latestOrder: latestOrder[0],
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
    cartCount = await Cart.findAndCountAll({
      where: { userId: req.session.userData.id },
    });
    cartCount = cartCount.count;
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
      cartCount = await Cart.findAndCountAll({
        where: { userId: req.session.userData.id },
      });
      cartCount = cartCount.count;
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

exports.getAboutUs = async (req, res, next) => {
  let cartCount = 0;
  if (req.session.isUserLoggedIn) {
    cartCount = await Cart.findAndCountAll({
      where: { userId: req.session.userData.id },
    });
    cartCount = cartCount.count;
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

exports.getContactUs = async (req, res, next) => {
  let cartCount = 0;
  if (req.session.isUserLoggedIn) {
    cartCount = await Cart.findAndCountAll({
      where: { userId: req.session.userData.id },
    });
    cartCount = cartCount.count;
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

exports.getCatalog = async (req, res, next) => {
  let cartCount = 0;
  if (req.session.isUserLoggedIn) {
    cartCount = await Cart.findAndCountAll({
      where: { userId: req.session.userData.id },
    });
    cartCount = cartCount.count;
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
  try {
    const categoryData = await Category.findByPk(catId);
    const product = await Product.findAll({ where: { categoryId: catId } });
    const cat = await Category.findAll({ include: SubCategory });
    if (req.session.isUserLoggedIn) {
      cartCount = await Cart.findAndCountAll({
        where: { userId: req.session.userData.id },
      });
      cartCount = cartCount.count;
    }
    // console.log(cartCount);
    res.render("user/catalog", {
      pageTitle: categoryData.cat_name,
      menuList: cat,
      cartCount: cartCount,
      product: product,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getSubCategoryWiseProduct = async (req, res, next) => {
  const subCatId = req.params.subId;
  let cartCount = 0;
  try {
    const subCategoryData = await SubCategory.findByPk(subCatId, {
      include: Category,
    });
    const product = await Product.findAll({
      where: { subCategoryId: subCatId },
    });
    const cat = await Category.findAll({ include: SubCategory });
    if (req.session.isUserLoggedIn) {
      cartCount = await Cart.findAndCountAll({
        where: { userId: req.session.userData.id },
      });
      cartCount = cartCount.count;
    }

    res.render("user/sub-catalog", {
      pageTitle: subCategoryData,
      menuList: cat,
      cartCount: cartCount,
      product: product,
    });
  } catch (err) {
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
  try {
    const cat = await Category.findAll({ include: SubCategory });
    // console.log(req.session.userData.id);
    const cartProd = await Cart.findAll({
      where: { userId: req.session.userData.id },
      include: Product,
    });
    const cartCount = await Cart.findAndCountAll({
      where: { userId: req.session.userData.id },
    });
    // console.log(cartProd);
    let cartSubTotal = 0;
    cartProd.forEach((cartItem) => {
      cartSubTotal += cartItem.quantity * cartItem.product.salePrice;
    });
    let shipping = 0;
    if (cartSubTotal < 999) {
      shipping = 99;
    }
    let cartTotal = cartSubTotal + shipping;
    res.render("user/cart", {
      pageTitle: "Cart | Fly-Zone",
      menuList: cat,
      cartCount: cartCount.count,
      cartProd: cartProd,
      cartTotal: cartTotal,
      cartSubTotal: cartSubTotal,
      shipping: shipping,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.removeFromCart = (req, res, next) => {
  const cartId = req.params.cartId;
  Cart.destroy({ where: { id: cartId } })
    .then(() => {
      res.redirect("/cart");
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
    quantity: quantity,
  })
    .then((cart) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCheckout = async (req, res, next) => {
  try {
    let message = req.flash("message");
    // console.log(message);
    let cartCount = await Cart.findAndCountAll({
      where: { userId: req.session.userData.id },
    });
    cartCount = cartCount.count;
    const cat = await Category.findAll({ include: SubCategory });
    const userAddress = await UserAddress.findAll({
      where: { userId: req.session.userData.id },
    });
    const cartProd = await Cart.findAll({
      where: { userId: req.session.userData.id },
      include: Product,
    });
    let cartSubTotal = 0;
    cartProd.forEach((cartItem) => {
      cartSubTotal += cartItem.quantity * cartItem.product.salePrice;
    });
    let shipping = 0;
    if (cartSubTotal < 999) {
      shipping = 99;
    }
    let cartTotal = cartSubTotal + shipping;
    res.render("user/checkout", {
      pageTitle: "CheckOut | Fly-Zone",
      menuList: cat,
      cartCount: cartCount,
      userAddress: userAddress,
      cartProd: cartProd,
      cartTotal: cartTotal,
      shipping: shipping,
      cartSubTotal: cartSubTotal,
      errorMessage: message,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.addNewAddressModel = (req, res, next) => {
  res.render("user/add-new-address-model");
};

exports.addNewDeliveryAddress = (req, res, next) => {
  const errors = validationResult(req);
  let message;
  if (!errors.isEmpty()) {
    message = errors.array()[0].msg;
    req.flash("message", "Error: " + message);
    return res.redirect("/checkout");
  }
  const userAddress = {
    name: req.body.name,
    mobile: req.body.mobile,
    address: req.body.addressLine,
    pincode: req.body.pincode,
    district: req.body.district,
    state: req.body.state,
    userId: req.session.userData.id,
  };
  UserAddress.create(userAddress)
    .then((userAdd) => {
      if (userAdd) {
        res.redirect("/checkout");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.placeOrder = async (req, res, next) => {
  const addressId = req.body.addressId;
  const paymentMode = req.body.payment_method;
  const cartProd = await Cart.findAll({
    where: { userId: req.session.userData.id },
    include: [
      {
        model: Product,
        include: Seller,
      },
    ],
  });
  let cartSubTotal = 0;
  cartProd.forEach((cartItem) => {
    cartSubTotal += cartItem.quantity * cartItem.product.salePrice;
  });
  let shipping = 0;
  if (cartSubTotal < 999) {
    shipping = 99;
  }
  // let cartTotal = cartSubTotal + shipping;
  const order = await Orders.create({
    orderNo: "ORD-" + orderid.generate(),
    orderValue: cartSubTotal,
    shippingValue: shipping,
    userId: req.session.userData.id,
    userAddressId: addressId,
    paymentMode: paymentMode,
  });
  if (order) {
    for (const cartItem of cartProd) {
      await OrderList.create({
        quantity: cartItem.quantity,
        orderId: order.id,
        productName: cartItem.product.title,
        productMRP: cartItem.product.mrp,
        productSalePrice: cartItem.product.salePrice,
        sellerName: cartItem.product.seller.name,
        sellerEmail: cartItem.product.seller.email,
        sellerMobile: cartItem.product.seller.mobile,
      });
      const prod = await Product.findByPk(cartItem.product.id);
      prod.stock = prod.stock - cartItem.quantity;
      await prod.save();
    }
    await Cart.destroy({ where: { userId: req.session.userData.id } });
    res.redirect("/");
  }
};

exports.userOrders = async (req, res, next) => {
  const orderDetails = await Orders.findAll({
    where: { userId: req.session.userData.id },
    include: OrderList,
  });
  // console.log(orderDetails[0].orderLists);

  let cartCount = await Cart.findAndCountAll({
    where: { userId: req.session.userData.id },
  });
  cartCount = cartCount.count;
  const cat = await Category.findAll({ include: SubCategory });
  res.render("user/orders", {
    pageTitle: "Fly-Zone | Orders",
    cartCount: cartCount,
    menuList: cat,
    orderDetails: orderDetails,
  });
};
