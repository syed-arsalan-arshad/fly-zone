const router = require("express").Router();
const { body } = require("express-validator/check");
const userController = require("../controllers/user");
const isUserAuth = require("../middleware/is-userAuth");

router.get("/", userController.getIndex);

router.get("/category/:catId", userController.getCategoryWiseProduct);

router.get(
  "/category/sub-category/:subId",
  userController.getSubCategoryWiseProduct
);

router.get("/catalog", userController.getCatalog);

router.get("/cart", userController.getCart);

router.get("/product-details/:proId", userController.getProductDetails);

router.get("/checkout", isUserAuth, userController.getCheckout);

router.get("/about-us", userController.getAboutUs);
router.get("/contact-us", userController.getContactUs);
router.get("/login", userController.getLogin);
router.get("/user-profile", isUserAuth, userController.userProfile);
router.get("/update-profile", isUserAuth, userController.updateProfile);
router.post("/update-profile", isUserAuth, userController.postUpdateProfile);
router.get("/logout", userController.userLogout);

router.post(
  "/send-otp",
  [
    body("mobileNo")
      .not()
      .isEmpty()
      .withMessage("Enter Mobile Number")
      .isLength({ max: 10, min: 10 })
      .withMessage("Mobile Number Must Be In 10-digits"),
  ],
  userController.sendOTP
);
router.post("/verify-otp", userController.verifyOTP);

router.post("/add-to-cart", isUserAuth, userController.addToCart);

router.get(
  "/remove-product/:cartId",
  isUserAuth,
  userController.removeFromCart
);

router.get(
  "/add-new-address-model",
  isUserAuth,
  userController.addNewAddressModel
);

router.post(
  "/add-new-delivery-address",
  isUserAuth,
  [
    body("name").not().isEmpty().withMessage("Fill The Name"),
    body("mobile").isLength({ min: 10, max: 10 }),
    body('pincode').isLength({min: 6, max: 6}).withMessage('Pincode Must Be In 8-Digit'),
    body('addressLine').not().isEmpty().withMessage('Address Must Be Fill'),
    body('district').not().isEmpty().withMessage('District Must Be Fill'),
    body('state').not().isEmpty().withMessage('District Must Be Fill')
  ],
  userController.addNewDeliveryAddress
);

router.get('/order-list', userController.userOrders);

router.post('/place-order', userController.placeOrder);

router.post('/get-invoice', userController.getInvoice);

module.exports = router;
