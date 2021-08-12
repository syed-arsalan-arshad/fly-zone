const { validationResult } = require("express-validator/check");
const Category = require("../models/category");
const Seller = require("../models/seller");
const SubCategory = require("../models/sub-category");
const Product = require("../models/product");
const Label = require("../models/productLabel");
const fs = require("fs");
const path = require("path");
const OrderList = require("../models/order-list");
const Orders = require("../models/orders");

var easyinvoice = require("easyinvoice");
const UserAddress = require("../models/user-address");

exports.getIndex = async (req, res, next) => {
  const productCount = await Product.findAndCountAll({
    where: { sellerId: req.session.sellerData.id },
  });
  res.render("seller/index", {
    path: "/",
    sidePath: "/",
    productCount: productCount.count,
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
  const mrp = req.body.mrp;
  const description = req.body.description;
  const catId = req.body.category;
  const subcatId = req.body.subcategory;
  const mainImage = req.files[0].path;
  const smallFront = req.files[1].path;
  const smallBack = req.files[2].path;
  const salePrice = req.body.salePrice;
  const stock = req.body.stock;
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
      mrp: mrp,
      categoryId: category.id,
      subCategoryId: subcategory.id,
      sellerId: req.session.sellerData.id,
      salePrice: salePrice,
      stock: stock,
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
  const proId = req.params.proId;
  Product.findByPk(proId, { include: [Category, SubCategory] })
    .then((product) => {
      res.render("seller/product-details", {
        path: "",
        sidePath: "/view-product",
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.seeImage = (req, res, next) => {
  const imagePath = req.params.imagePath;
  const path = "images/" + imagePath;

  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
    }
    const fileName = path.split("/")[1];
    const fileType = path.split(".")[1];
    res.setHeader("Content-Type", "image/" + fileType);
    res.setHeader("Content-Disposition", 'inline; filename="' + fileName + '"');
    res.send(data);
  });
};

exports.editProduct = async (req, res, next) => {
  const proId = req.params.proId;
  try {
    const cat = await Category.findAll();
    const subcat = await SubCategory.findAll({ include: Category });
    const product = await Product.findByPk(proId, {
      include: [Category, SubCategory],
    });
    res.render("seller/edit-product", {
      path: "",
      sidePath: "/view-product",
      product: product,
      errorMessage: "",
      cat: cat,
      subcat: subcat,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const errors = validationResult(req);
  const title = req.body.title;
  const mrp = req.body.mrp;
  const description = req.body.description;
  const catId = req.body.category;
  const subcatId = req.body.subcategory;
  const mainImage = req.files[0];
  const smallFront = req.files[1];
  const smallBack = req.files[2];
  const salePrice = req.body.salePrice;
  const stock = req.body.stock;
  const proId = req.body.id;

  try {
    const cat = await Category.findByPk(catId);
    const subcat = await SubCategory.findByPk(subcatId);
    const product = await Product.findByPk(proId, {
      include: [Category, SubCategory],
    });

    if (!errors.isEmpty()) {
      const catNew = await Category.findAll();
      const subcatNew = await SubCategory.findAll({ include: Category });
      return res.render("seller/edit-product", {
        path: "",
        sidePath: "/view-product",
        product: product,
        errorMessage: "",
        cat: catNew,
        subcat: subcatNew,
      });
    }

    product.title = title;
    product.mrp = mrp;
    product.salePrice = salePrice;
    product.description = description;
    product.categoryId = cat.id;
    product.subCategoryId = subcat.id;
    product.stock = stock;
    if (mainImage) {
      deleteFile(product.mainImage);
      product.mainImage = mainImage.path;
    }
    if (smallFront) {
      deleteFile(product.smallFront);
      product.smallFront = smallFront.path;
    }
    if (smallBack) {
      deleteFile(product.smallBack);
      product.smallBack = smallBack.path;
    }
    const pro = await product.save();
    console.log(pro + "pro");
    res.redirect("/seller/view-product");
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProduct = (req, res, next) => {
  const proId = req.params.proId;
  Product.findByPk(proId)
    .then((product) => {
      deleteFile(product.mainImage);
      deleteFile(product.smallBack);
      deleteFile(product.smallFront);
      return Product.destroy({ where: { id: proId } });
    })
    .then(() => {
      res.redirect("/seller/view-product");
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.getLabels = async (req, res, next) => {
  const proId = req.params.proId;
  try {
    const product = await Product.findByPk(proId);
    const labels = await Label.findAll({ where: { productId: proId } });
    console.log(labels);
    res.render("seller/labels-view", {
      path: "",
      sidePath: "/view-product",
      product: product,
      labels: labels,
      errorMessage: "",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postAddLabels = async (req, res, next) => {
  const errors = validationResult(req);
  const label = req.body.label;
  const value = req.body.value;
  const proId = req.body.proId;
  try {
    const product = await Product.findByPk(proId);
    if (!errors.isEmpty()) {
      const labels = await Label.findAll({ where: { productId: proId } });
      //console.log(labels);
      return res.render("seller/labels-view", {
        path: "",
        sidePath: "/view-product",
        product: product,
        labels: labels,
        errorMessage: errors.array()[0].msg,
      });
    }
    await Label.create({
      label: label,
      value: value,
      productId: product.id,
    });
    res.redirect("/seller/add-labels/" + proId);
  } catch (err) {
    console.log(err);
  }
};

exports.orderList = async (req, res, next) => {
  // const orderDetails = await OrderList.findAll({include: [{model: Product, where: {sellerId: req.session.sellerData.id}}, Orders],
  // });
  const orderDetails = await OrderList.findAll({
    where: { sellerMobile: req.session.sellerData.mobile },
    include: Orders,
  });
  // console.log(orderDetails);
  res.render("seller/order-list", {
    path: "",
    sidePath: "/order-list",
    orderList: orderDetails,
  });
};

exports.changeOrderStatus = async (req, res, next) => {
  const orderId = req.body.orderId;
  const updatedStatus = req.body.updatedStatus;

  try {
    const order = await OrderList.update(
      {
        status: updatedStatus,
      },
      {
        where: {
          id: orderId,
        },
      }
    );
    if (order) {
      if (updatedStatus == 4) {
        const invoiceDetails = await OrderList.findByPk(orderId, {
          include: [{ model: Orders, include: UserAddress }],
        });
        // console.log(invoiceDetails);
        generateInvoice(invoiceDetails);
      }
      res.redirect("/seller/order-list");
    }
  } catch (err) {
    console.log(err);
  }
};

async function generateInvoice(invoiceDetails) {
  let imgPath = path.resolve("public/user/img", "flyzone_logo.png");
  const invName = "INV_" + (new Date()).getTime();
  const invoiceName = invName + ".pdf";
  await OrderList.update({invoiceFileName: invoiceName},{where: {id: invoiceDetails.id}});
  const invoicePath = path.join("user-invoice", invoiceName);
  // console.log(imgPath);
  const taxableValue = ((invoiceDetails.productSalePrice * 100) / 105).toFixed(2);
  var data = {
    //"documentTitle": "RECEIPT", //Defaults to INVOICE
    //"locale": "de-DE", //Defaults to en-US, used for number formatting (see docs)
    currency: "INR", //See documentation 'Locales and Currency' for more info
    taxNotation: "GST", //or gst
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25,
    logo: `${base64_encode(imgPath)}`, //or base64
    // background: `${base64_encode(imgPath)}`, //or base64 //img or pdf
    sender: {
      company: invoiceDetails.sellerName,
      address: "Urdu Bazar Lane",
      zip: "812002",
      city: "Bhagalpur",
      country: "India",
      "custom1": invoiceDetails.sellerEmail,
      "custom2": invoiceDetails.sellerMobile,
      //"custom3": "custom value 3"
    },
    client: {
      company: invoiceDetails.order.userAddress.name,
      address: invoiceDetails.order.userAddress.address,
      zip: invoiceDetails.order.userAddress.pincode,
      city: invoiceDetails.order.userAddress.district,
      country: "India",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    invoiceNumber: invName,
    invoiceDate: getCurrentDate(),
    products: [
      {
        quantity: invoiceDetails.quantity,
        description: invoiceDetails.productName,
        tax: 5,
        price: taxableValue,
      },
    ],
    bottomNotice: "Thank You For Shopping! Have A Good Day.",
    //Used for translating the headers to your preferred language
    //Defaults to English. Below example is translated to Dutch
    // "translate": {
    //     "invoiceNumber": "Factuurnummer",
    //     "invoiceDate": "Factuurdatum",
    //     "products": "Producten",
    //     "quantity": "Aantal",
    //     "price": "Prijs",
    //     "subtotal": "Subtotaal",
    //     "total": "Totaal"
    // }
  };

  //Create your invoice! Easy!
  const result = await easyinvoice.createInvoice(data);
  await fs.writeFileSync(invoicePath, result.pdf, "base64");
}

function base64_encode(img) {
  // read binary data
  let png = fs.readFileSync(img);
  // convert binary data to base64 encoded string
  return new Buffer.from(png).toString("base64");
}

function getCurrentDate(){
  const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
  const dateObj = new Date();
  const month = monthNames[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const output = day + '/' + month + '/' + year;
  return output;
}