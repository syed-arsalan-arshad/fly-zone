const router = require("express").Router();
const { body } = require("express-validator/check");
const isAuth = require("../middleware/is-auth");
const adminController = require("../controllers/admin");

router.get("/", isAuth, adminController.getIndex);

router.get("/login", adminController.getLogin);

router.post(
  "/login",
  [
    body("mobile")
      .isLength({ min: 10, max: 10 })
      .withMessage("Number Must Be 10 Digit"),
    body("password")
      .isAlphanumeric()
      .withMessage("Password Must Be Alpha-Numeric Only")
      .isLength({ min: 8, max: 10 })
      .withMessage("Password Must Be in between 8 to 16 character"),
  ],
  adminController.postLogin
);

// router.get("/add-product", isAuth, adminController.getAddProduct);

// router.post(
//   "/add-product",
//   isAuth,
//   [
//     body("title")
//       .isString()
//       .withMessage("Title is in alphanumeric order")
//       .isLength({ min: 5 })
//       .withMessage("Title should be of 5 character"),
//     body("price")
//       .isDecimal()
//       .withMessage("Price should be in decimal form")
//       .not()
//       .isEmpty()
//       .withMessage("Price should not be empty"),
//     body("description")
//       .isString()
//       .withMessage("Description is in alphanumeric order")
//       .isLength({ min: 10 })
//       .withMessage("Description should be of 10 character"),
//   ],
//   adminController.postAddProduct
// );

router.get("/add-category", isAuth, adminController.getAddCategory);

router.post(
  "/add-category",
  [body("cat_name").not().isEmpty().withMessage("Enter Some Category Name")],
  adminController.postAddCategory
);

router.get("/add-sub-category", isAuth, adminController.getAddSubCategory);

router.post(
  "/add-sub-category",
  [body("subCat").not().isEmpty().withMessage("Enter Some Category Name")],
  adminController.postAddSubCategory
);

// router.get("/view-product", isAuth, adminController.getViewProduct);

router.get("/view-category", isAuth, adminController.getViewCategory);

router.get("/view-sub-category", isAuth, adminController.getViewSubCategory);

router.get("/edit-category/:catId", adminController.getEditCategory);

router.get("/delete-category/:catId", adminController.getDeleteCategory);

router.get('/seller-request/:status', isAuth, adminController.sellerRequest);

router.get('/all-seller-list', adminController.allSeller);

router.get('/seller-details/:sellerId', adminController.sellerDetails);

router.post('/seller-status-change', adminController.sellerStatusChanged);

router.get('/download-logo/:sellerId', adminController.downloadLogo);

router.get('/download-docs/:sellerId', adminController.downloadDocs);

router.get("/logout", adminController.postLogout);

module.exports = router;
