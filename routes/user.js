const router = require('express').Router();
const { body } = require('express-validator/check');
const userController = require('../controllers/user');
const isUserAuth = require('../middleware/is-userAuth');

router.get('/', userController.getIndex);

router.get('/category/:catId', userController.getCategoryWiseProduct);

router.get('/category/sub-category/:subId', userController.getSubCategoryWiseProduct);

router.get('/catalog', userController.getCatalog);

router.get('/cart', userController.getCart);

router.get('/product-details/:proId', userController.getProductDetails);

router.get('/checkout');


router.get('/about-us', userController.getAboutUs);
router.get('/contact-us', userController.getContactUs);
router.get('/login', userController.getLogin);
router.get('/user-profile', isUserAuth, userController.userProfile);
router.get('/update-profile', isUserAuth, userController.updateProfile);
router.post('/update-profile', isUserAuth, userController.postUpdateProfile);
router.get('/logout', userController.userLogout);

router.post('/send-otp', [
    body('mobileNo')
    .not()
    .isEmpty()
    .withMessage('Enter Mobile Number')
    .isLength({max: 10, min: 10})
    .withMessage('Mobile Number Must Be In 10-digits')
], userController.sendOTP);
router.post('/verify-otp', userController.verifyOTP);

router.post('/add-to-cart', isUserAuth, userController.addToCart);


module.exports = router;