var express = require("express")
var router = express.Router()
var Product = require("../models/product")
var middlewareObj = require("../middleware")

// Archives
router.get("/", function (req, res) {
    res.redirect("/")
})

// Create new product
router.get("/new", middlewareObj.isLoggedIn, function (req, res) {
    res.render("products/new")
})

router.post("/", middlewareObj.isLoggedIn, function (req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newProduct = { title: req.body.title, image: req.body.image, price: req.body.price, content: req.body.content, author: author }

    Product.create(newProduct, function (err, newlyCreated) {
        if (err) {
            req.flash("error", err.message)
        } else {
            req.flash("success", "Product uploaded, admin review required.")
            res.redirect("/")
        }
    })
})

// Show product
router.get("/:id", function (req, res) {
    Product.findById(req.params.id).populate("comments").exec(function (err, foundProduct) {
        if (err) {
            req.flash("error", err.message)
        } else {
            res.render("products/show", { product: foundProduct })
        }
    })
})

// Edit
router.get("/:id/edit", middlewareObj.checkProductOwnership, function (req, res) {
    Product.findById(req.params.id, function (err, foundProduct) {
        res.render("products/edit", { product: foundProduct })
    })
})

router.put("/:id", middlewareObj.checkProductOwnership, function (req, res) {
    Product.findByIdAndUpdate(req.params.id, req.body.product, function (err, foundProduct) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/products")
        } else {
            res.redirect("/products/" + req.params.id)
        }
    })
})

// Delete
router.delete("/:id", middlewareObj.checkAdmin, function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/products")
        } else {
            res.redirect("/products")
        }
    })
})

module.exports = router