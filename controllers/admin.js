const Product = require("../models/product");
const Category = require("../models/category");
const { validationResult } = require("express-validator/check");
const SubCategory = require("../models/sub-category");
const Seller = require("../models/seller");
const fs = require('fs');
const User = require("../models/user");
exports.getIndex = async (req, res, next) => {
  const allSellerCount = await Seller.findAndCountAll();
  // console.log(allSellerCount);
  const requestedSellerCount = await Seller.findAndCountAll({where: {status: 0}});
  const acceptedSellerCount = await Seller.findAndCountAll({where: {status: 1}});
  const rejectedSellerCount = await Seller.findAndCountAll({where: {status: 2}});
  const userCount = await User.findAndCountAll();
  const productCount = await Product.findAndCountAll();
  console.log("Index");
  res.render("admin/index", {
    path: "/",
    sidePath: "/",
    count: {
      allSellerCount: allSellerCount.count,
      acceptedSellerCount: acceptedSellerCount.count,
      requestedSellerCount: requestedSellerCount.count,
      rejectedSellerCount: rejectedSellerCount.count,
      userCount: userCount.count,
      productCount: productCount.count
    }
  });
};

exports.getLogin = (req, res, next) => {
  res.render("admin/login", {
    path: "/login",
    errorMessage: "",
  });
};

exports.postLogin = (req, res, next) => {
  console.log("postLogin");
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.render("admin/login", {
      path: "/login",
      errorMessage: error.array()[0].msg,
    });
  }
  const mobile = req.body.mobile;
  const password = req.body.password;
  if (mobile != "9097862014" || password !== "12345678") {
    return res.render("admin/login", {
      path: "/login",
      errorMessage: "Admin Credential Not Matched",
    });
  }
  req.session.isAdminLoggedIn = true;
  res.redirect("/admin");
};

// exports.getAddProduct = (req, res, next) => {
//   let proCat;
//   Category.findAll()
//     .then((cat) => {
//       proCat = cat;
//       return SubCategory.findAll({include: Category});
//     })
//     .then(subcat => {
//       //console.log(subcat);
//       res.render("admin/add-product", {
//         path: "",
//         sidePath: "/add-product",
//         cat: proCat,
//         subcat: subcat,
//         errorMessage: "",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postAddProduct = async (req, res, next) => {
//   const error = validationResult(req);
//   const title = req.body.title;
//   const price = req.body.price;
//   const description = req.body.description;
//   const catId = req.body.category;
//   const subcatId = req.body.subcategory;
//   const mainImage = req.files[0].path;
//   const smallFront = req.files[1].path;
//   const smallBack = req.files[2].path;
//   // console.log(imageUrl);

//   try {
//     const cat = await Category.findAll();
//     const subcat = await SubCategory.findAll();
//     if (!error.isEmpty()) {
//       return res.render("admin/add-product", {
//         path: "",
//         sidePath: "/add-product",
//         cat: cat,
//         subcat: subcat,
//         errorMessage: error.array()[0].msg,
//       });
//     }
//     if (!mainImage || !smallFront || !smallBack) {
//       return res.render("admin/add-product", {
//         path: "",
//         sidePath: "/add-product",
//         cat: cat,
//         subcat: subcat,
//         errorMessage: error.array()[0].msg,
//       });
//     }
//     const category = await Category.findByPk(catId);
//     const subcategory = await SubCategory.findByPk(subcatId);
//     // console.log(category.id);
//     await Product.create({
//       title: title,
//       mainImage: mainImage,
//       smallFront: smallFront,
//       smallBack: smallBack,
//       description: description,
//       price: price,
//       categoryId: category.id,
//       subCategoryId: subcategory.id
//     });
//     res.redirect("/admin/view-product");
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.getViewProduct = (req, res, next) => {
//   Product.findAll()
//     .then((products) => {
//       // console.log(products);
//       res.render("admin/view-product", {
//         path: "",
//         sidePath: "/view-product",
//         prods: products,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

exports.getAddCategory = (req, res, next) => {
  res.render("admin/add-category", {
    path: "",
    sidePath: "/add-category",
    errorMessage: "",
  });
};

exports.postAddCategory = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.render("admin/add-category", {
      path: "",
      sidePath: "/add-category",
      errorMessage: error.array()[0].msg,
    });
  }
  const cat_name = req.body.cat_name;
  const status = req.body.status;
  // console.log(status, cat_name);
  Category.create({
    cat_name: cat_name,
    status: status,
  })
    .then((result) => {
      // console.log(result);
      res.redirect("/admin/view-category");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddSubCategory = (req, res, next) => {
  Category.findAll()
    .then((cat) => {
      res.render("admin/add-subCat", {
        path: "",
        sidePath: "/add-sub-category",
        errorMessage: "",
        cat: cat,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddSubCategory = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.render("admin/add-subCat", {
      path: "",
      sidePath: "/add-category",
      errorMessage: error.array()[0].msg,
    });
  }
  const subCat = req.body.subCat;
  const catId = req.body.catId;
  const status = req.body.status;
  const category = await Category.findByPk(catId);
  // console.log(status, cat_name);
  SubCategory.create({
    sub_cat_name: subCat,
    categoryId: category.id,
    status: status,
  })
    .then((result) => {
      // console.log(result);
      res.redirect("/admin/view-sub-category");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getViewCategory = (req, res, next) => {
  Category.findAll()
    .then((cat) => {
      res.render("admin/view-category", {
        path: "",
        sidePath: "/view-category",
        cat: cat,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getViewSubCategory = (req, res, next) => {
  SubCategory.findAll({ include: Category })
    .then((cat) => {
      console.log(cat);
      res.render("admin/view-sub-category", {
        path: "",
        sidePath: "/view-sub-category",
        cat: cat,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditCategory = (req, res, next) => {
  const catId = req.params.catId;
};

exports.getDeleteCategory = (req, res, next) => {
  const catId = req.params.catId;
  // console.log(catId);
};

exports.allSeller = async (req, res, next) => {
  try {
    const sellerData = await Seller.findAll();
    res.render("admin/seller-request-list", {
      path: "",
      sidePath: '/seller-all',
      sellerData: sellerData,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.sellerRequest = async (req, res, next) => {
  const status = req.params.status;
  let sidePath;
  if(status == 0){
    sidePath = "/seller-request";
  }else if(status == 1){
    sidePath = "/seller-accepted"
  }else{
    sidePath = "/seller-rejected"
  }
  try {
    const sellerData = await Seller.findAll({where: {status: status}});
    res.render("admin/seller-request-list", {
      path: "",
      sidePath: sidePath,
      sellerData: sellerData,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.sellerDetails = (req, res, next) => {
  const sellerId = req.params.sellerId;
  Seller.findByPk(sellerId)
    .then((seller) => {
      res.render("admin/seller-details", {
        path: "",
        sidePath: "/seller-request",
        sellerData: seller,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.downloadLogo = async (req, res, next) => {
  const sellerId = req.params.sellerId;
  try{
    const seller = await Seller.findByPk(sellerId);
    fs.readFile(seller.shopLogo, (err, data) => {
      if(err){
        console.log(err);
      }
      const fileName = seller.shopLogo.split('\\')[1];
      const fileType = seller.shopLogo.split('.')[1];
      res.setHeader('Content-Type', 'image/' + fileType);
      res.setHeader('Content-Disposition', 'inline; filename="'+ fileName +'"');
      res.send(data);
    })
    
  }catch(err){
    console.log(err);
  }
};

exports.downloadDocs = async (req, res, next) => {
  const sellerId = req.params.sellerId;
  try{
    const seller = await Seller.findByPk(sellerId);
    fs.readFile(seller.docs, (err, data) => {
      if(err){
        console.log(err);
      }
      const fileName = seller.docs.split('\\')[1];
      const fileType = seller.docs.split('.')[1];
      if(fileType === 'pdf')
        res.setHeader('Content-Type', 'application/pdf');
      else
        res.setHeader('Content-Type', 'image/' + fileType);
      res.setHeader('Content-Disposition', 'inline; filename="'+ fileName +'"');
      res.send(data);
    })
    
  }catch(err){
    console.log(err);
  }
};

exports.sellerStatusChanged = (req, res, next) => {
  const status = req.body.status;
  const sellerId = req.body.sellerId;
  Seller.update({status: status}, {where: {id: sellerId}})
  .then(seller => {
    if(seller){
      res.redirect('/admin/seller-request/'+status);
    }
  })
  .catch(err => {
    console.log(err);
  })

};

exports.postLogout = (req, res, next) => {
  if (
    req.session.isAdminLoggedIn == true &&
    req.session.isUserLoggedIn == true
  ) {
    req.session.isAdminLoggedIn = false;
  } else {
    req.session.destroy((err) => {
      console.log(err);
    });
  }
  res.redirect("/admin");
};
