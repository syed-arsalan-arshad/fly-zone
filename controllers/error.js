const Category = require("../models/category");
const SubCategory = require("../models/sub-category");
exports.get404 = (req, res, next) => {
    Category.findAll({include: SubCategory})
    .then(cat => {
        res.render('user/404', {
            pageTitle: 'Error | Fly-Zone',
            menuList: cat
        });
    })
    .catch(err => {
        console.log(err);
    });
};