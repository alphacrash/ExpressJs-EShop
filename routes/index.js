var express = require("express")
var router = express.Router()
var passport = require("passport")
var User = require("../models/user")
var Product = require("../models/product")
var Cart = require("../models/cart")
var Order = require("../models/order")
var middlewareObj = require("../middleware")

// Index Page
router.get("/", function (req, res) {
    if (req.isAuthenticated() && req.user.username == 'admin') {
        res.redirect("/admin")
    } else {
        Product.find({ "condition": { "$ne": "Default" } }, function (err, products) {
            if (err) {
                req.flash("error", err.message)
                res.redirect("/")
            } else {
                res.render("products/products", { products })
            }
        })
    }
})

router.post("/search", function (req, res) {
    if (req.isAuthenticated()) {
        Product.find({ "title": { $regex: req.body.title, $options: 'i' }, "condition": { "$ne": "Default" } }, function (err, products) {
            if (err) {
                req.flash("error", err.message)
                return res.redirect("back")
            } else {
                res.render("products/products", { products })
            }
        })
    } else {
        Product.find({ "title": { $regex: req.body.title, $options: 'i' }, "condition": { "$ne": "Default" } }, function (err, products) {
            if (err) {
                req.flash("error", err.message)
                return res.redirect("back")
            } else {
                res.render("products/products", { products })
            }
        })
    }
})

router.get("/orders", middlewareObj.isLoggedIn, function (req, res) {
    Order.find({ user: { id: req.user._id, username: req.user.username } }, function (err, orders) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("back")
        } else {
            var cart
            orders.forEach(function (order) {
                cart = new Cart(order.cart)
                order.items = cart.generateArray()
            })
            res.render("account/orders", { orders })
        }
    })
})

router.get("/order-history", function (req, res) {
    Order.find({}, function (err, orders) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("back")
        } else {
            var cart
            orders.forEach(function (order) {
                cart = new Cart(order.cart)
                order.items = cart.generateArray()
            })
            res.render("store/order-history", { orders })
        }
    })
})

router.get("/sellers", function (req, res) {
    Product.find({}, function (err, products) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("back")
        } else {
            res.render("account/sellers", { products })
        }
    })
})

router.get("/team", function (req, res) {
    res.render("account/team")
})

router.get("/help", function (req, res) {
    res.render("account/help")
})

router.get("/add-to-cart/:id", function (req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {})

    Product.findById(req.params.id, function (err, product) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("back")
        } else {
            cart.add(product, product._id)
            req.session.cart = cart
            req.flash("success", "Item successfully added to the cart.")
            res.redirect("/")
        }
    })
})

router.get("/remove/:id", function (req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {})

    cart.reduceByOne(req.params.id)
    req.session.cart = cart;
    res.redirect("/shopping-cart")
})

router.get("/shopping-cart", middlewareObj.isLoggedIn, function (req, res) {
    if (!req.session.cart) {
        res.render("store/shopping-cart", { products: null })
    } else {
        var cart = new Cart(req.session.cart)
        res.render("store/shopping-cart", { products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty })
    }
})

router.get("/checkout", middlewareObj.isLoggedIn, function (req, res) {
    if (!req.session, cart) {
        res.redirect("/shopping-cart")
    } else {
        var cart = new Cart(req.session.cart)
        res.render("store/checkout", { total: cart.totalPrice })
    }
})

router.post("/checkout", middlewareObj.isLoggedIn, function (req, res) {
    if (!req.session.cart) {
        res.redirect("/shopping-cart")
    } else {
        var cart = new Cart(req.session.cart)
        var orderDetails = {
            cart: cart,
            address: req.body.address,
            name: req.body.name,
        }
        Order.create(orderDetails, function (err, order) {
            if (err) {
                req.flash("error", err.message)
                res.redirect("back")
            } else {
                order.user.id = req.user._id
                order.user.username = req.user.username
                order.save(function (err, result) {
                    if (err) {
                        res.redirect("back")
                    } else {
                        req.flash("success", "Successfully bought product!")
                        req.session.cart = null
                        res.redirect("/")
                    }
                })
            }
        })
    }
})

router.get("/register", function (req, res) {
    res.render("auth/register")
})

router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("back")
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to Express Blog")
                res.redirect("/products")
            })
        }
    })
})

router.get("/login", function (req, res) {
    res.render("auth/login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/loginfailed"
}), function (req, res) { })

router.get("/loginfailed", function (req, res) {
    if (!req.user) {
        req.flash("error", "Username or password is incorrect.")
        res.redirect("/login")
    }
})

router.get("/logout", function (req, res) {
    req.logout()
    req.flash("success", "You have been successfully logged out.")
    res.redirect("/")
})

module.exports = router