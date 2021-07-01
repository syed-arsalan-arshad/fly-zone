module.exports = (req, res, next) => {
    if(!req.session.isAdminLoggedIn){
        console.log('Logined');
        return res.redirect('/admin/login');
    }
    next();
};