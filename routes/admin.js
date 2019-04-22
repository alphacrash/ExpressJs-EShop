var express = require("express")
var router = express.Router()
var Product = require("../models/product")
var middlewareObj = require("../middleware")

router.get("/", middlewareObj.checkAdmin, (req, res) => {
    Product.find({}, function (err, products) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/")
        } else {
            res.render("admin/index", { products })
        }
    })
})

router.get("/:id", middlewareObj.checkAdmin, (req, res) => {
    Product.findById(req.params.id, function (err, foundProduct) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/")
        } else {
            res.render("admin/show", { product: foundProduct })
        }
    })
})

router.post("/:id", middlewareObj.checkAdmin, (req, res) => {
    Product.findByIdAndUpdate(req.params.id, { condition: req.body.condition }, function (err, updatedProduct) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/admin")
        } else {
            res.redirect("/admin")
        }
    })
})

module.exports = router