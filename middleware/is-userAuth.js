module.exports = (req, res, next) => {
    if(!req.session.isUserLoggedIn){
        console.log('Logined');
        return res.redirect('/login');
    }
    next();
};