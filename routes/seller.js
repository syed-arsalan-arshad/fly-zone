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
    body("price")
      .isDecimal()
      .withMessage("Price should be in decimal form")
      .not()
      .isEmpty()
      .withMessage("Price should not be empty"),
    body("description")
      .isString()
      .withMessage("Description is in alphanumeric order")
      .isLength({ min: 10 })
      .withMessage("Description should be of 10 character"),
  ],
  sellerController.postAddProduct
);

router.get('/view-product', isSellerAuth, sellerController.getViewProduct);

router.get('/product-details', isSellerAuth, sellerController.productDetails);

module.exports = router;
