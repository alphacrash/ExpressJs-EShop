var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Product = require("../models/product");
var middlewareObj = require("../middleware");

// Index Page
router.get("/", function (req, res) {
    Product.find({}, function (err, allProducts) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/");
        } else {
            res.render("products/products", { products: allProducts });
        }
    });
});

router.get("/register", function (req, res) {
    res.render("auth/register");
});

router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to Express Blog");
                res.redirect("/products");
            });
        }
    });
});

router.get("/login", function (req, res) {
    res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/loginfailed"
}), function (req, res) { });

router.get("/loginfailed", function (req, res) {
    if (!req.user) {
        req.flash("error", "Username or password is incorrect.");
        res.redirect("/login");
    }
});

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You have been successfully logged out.");
    res.redirect("/");
});

module.exports = router;