const router = require("express").Router();
const isSellerAuth = require("../middleware/is-sellerAuth");
const { body } = require("express-validator/check");
const sellerController = require("../controllers/seller");

router.get("/", isSellerAuth, sellerController.getIndex);
router.get("/registration", sellerController.getRegistration);
router.post(
  "/registration",
  [
    body("name").not().isEmpty().withMessage("Enter Name"),
    body("email").isEmail().withMessage("Enter Valid Email"),
    body("mobile")
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile No should be in 10-digits"),
    body("shopName").not().isEmpty().withMessage("Shop Name must not be empty"),
    body("password", "Password Must Be In Between 8 - 16 character")
      .not()
      .isEmpty()
      .isLength({ min: 8, max: 16 }),
  ],
  sellerController.postRegistration
);

router.get("/login", sellerController.getLogin);

router.post(
  "/login",
  [
    body("mobile")
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile No Must Be Of 10-digits"),
    body("password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password Must Be In Between 8 to 10 Digits"),
  ],
  sellerController.postLogin
);

router.get("/logout", isSellerAuth, sellerController.logout);

router.get("/add-product", isSellerAuth, sellerController.getAddProduct);

router.post(
  "/add-product",
  isSellerAuth,
  [
    body("title")
      .isString()
      .withMessage("Title is in alphanumeric order")
      .isLength({ min: 5 })
      .withMessage("Title should be of 5 character"),
    body("mrp")
      .isDecimal()
      .withMessage("MRP should be in decimal form")
      .not()
      .isEmpty()
      .withMessage("MRP should not be empty"),
    body("salePrice")
      .isDecimal()
      .withMessage("Sale Price should be in decimal form")
      .not()
      .isEmpty()
      .withMessage("Sale Price should not be empty"),
    body("stock").not().isEmpty().withMessage("Stock should not be empty"),
    body("description")
      .isString()
      .withMessage("Description is in alphanumeric order")
      .isLength({ min: 10 })
      .withMessage("Description should be of 10 character"),
  ],
  sellerController.postAddProduct
);

router.get("/view-product", isSellerAuth, sellerController.getViewProduct);

router.get("/edit-product/:proId", isSellerAuth, sellerController.editProduct);

router.post(
  "/edit-product",
  isSellerAuth,
  [
    body("title")
      .isString()
      .withMessage("Title is in alphanumeric order")
      .isLength({ min: 5 })
      .withMessage("Title should be of 5 character"),
    body("mrp")
      .isDecimal()
      .withMessage("MRP should be in decimal form")
      .not()
      .isEmpty()
      .withMessage("MRP should not be empty"),
    body("salePrice")
      .isDecimal()
      .withMessage("Sale Price should be in decimal form")
      .not()
      .isEmpty()
      .withMessage("Sale Price should not be empty"),
    body("stock").not().isEmpty().withMessage("Stock should not be empty"),
    body("description")
      .isString()
      .withMessage("Description is in alphanumeric order")
      .isLength({ min: 10 })
      .withMessage("Description should be of 10 character"),
  ],
  sellerController.postEditProduct
);

router.get(
  "/delete-product/:proId",
  isSellerAuth,
  sellerController.deleteProduct
);

router.get(
  "/product-details/:proId",
  isSellerAuth,
  sellerController.productDetails
);

router.get(
  "/see-image/images/:imagePath",
  isSellerAuth,
  sellerController.seeImage
);

router.get("/add-labels/:proId", isSellerAuth, sellerController.getLabels);

router.post(
  "/add-labels/:proId",
  isSellerAuth,
  [
    body("label").not().isEmpty().withMessage("Label Field Must Be Filled"),
    body("value").not().isEmpty().withMessage("Value Field Must Be Filled"),
  ],
  sellerController.postAddLabels
);

router.get('/order-list', sellerController.orderList);

module.exports = router;
