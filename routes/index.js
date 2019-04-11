var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Product = require("../models/product");
var Cart = require("../models/cart");
var middlewareObj = require("../middleware");

// Index Page
router.get("/", function (req, res) {
    Product.find({}, function (err, products) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/");
        } else {
            res.render("products/products", { products });
        }
    });
});

router.post("/search", function (req, res) {
    Product.find({ "title": { $regex: req.body.title, $options: 'i' } }, function (err, products) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            res.render("products/products", { products })
        }
    })
})

router.get("/add-to-cart/:id", function (req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(req.params.id, function (err, product) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            cart.add(product, product._id);
            req.session.cart = cart;
            console.log(req.session.cart)
            res.redirect("/");
        }
    })
})

router.get("/shopping-cart", function (req, res) {
    if (!req.session.cart) {
        res.render("store/shopping-cart", { products: null })
    } else {
        var cart = new Cart(req.session.cart);
        res.render("store/shopping-cart", { products: cart.generateArray(), totalPrice: cart.totalPrice })
    }
})

router.get("/register", function (req, res) {
    res.render("auth/register");
});

router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
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