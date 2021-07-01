module.exports = (req, res, next) => {
    if(!req.session.isSellerLoggedIn){
        console.log('Logined');
        return res.redirect('/seller/login');
    }
    next();
};