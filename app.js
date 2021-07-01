//Importing Files
const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const SessionStore = require("express-session-sequelize")(session.Store);
const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const sellerRoutes = require("./routes/seller");
const errorController = require("./controllers/error");

const Category = require("./models/category");
const Product = require("./models/product");
const SubCategory = require("./models/sub-category");
const Seller = require("./models/seller");
const multer = require("multer");
const { copyFileSync } = require("fs");

const store = new SessionStore({
  db: sequelize,
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname == "docs" || file.fieldname == "shopLogo") {
      cb(null, "sellerDocs");
    } else {
      cb(null, "images");
    }
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.fieldname == "docs") {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
};
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).any(
    "main_image",
    "small_front",
    "small_back",
    "docs",
    "shopLogo"
  )
);
app.use(
  session({
    secret: "secret",
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.isAdminLoggedIn = req.session.isAdminLoggedIn;
  res.locals.isUserLoggedIn = req.session.isUserLoggedIn;
  res.locals.userData = req.session.userData;
  res.locals.isSellerLoggedIn = req.session.isSellerLoggedIn;
  res.locals.sellerData = req.session.sellerData;
  next();
});

//Registering Routes In Middleware
app.use(userRoutes);
app.use("/admin", adminRoutes);
app.use("/seller", sellerRoutes);
app.use(errorController.get404);

Product.belongsTo(Category, { constraint: true, onDelete: "CASCADE" });
Product.belongsTo(SubCategory, { constraint: true, onDelete: "CASCADE" });
Product.belongsTo(Seller, { constraint: true, onDelete: "CASCADE" });
SubCategory.belongsTo(Category, { constraint: true, onDelete: "CASCADE" });
Category.hasMany(SubCategory, { constraint: true, onDelete: "CASCADE" });
//Instatiate Server
sequelize
  // .sync({ force: true })
  sequelize.sync()
  .then((result) => {
    //console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
