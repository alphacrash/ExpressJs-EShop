var express = require("express")
var router = express.Router({ mergeParams: true })
var Product = require("../models/product")
var Comment = require("../models/comment")
var middlewareObj = require("../middleware") 

router.get("/new", middlewareObj.isLoggedIn, function (req, res) {
    Product.findById(req.params.id, function (err, foundProduct) {
        if (err) {
            req.flash("error", err.message) 
        } else {
            res.render("comments/new", { product: foundProduct })
        }
    })
})

router.post("/", function (req, res) {
    Product.findById(req.params.id, function (err, foundProduct) {
        if (err) {
            req.flash("error", err.message) 
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", err.message) 
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()
                    foundProduct.comments.push(comment)
                    foundProduct.save()
                    res.redirect("/products/" + foundProduct._id)
                }
            })
        }
    })
})

// Edit
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            req.flash("error", err.message) 
            res.redirect("back")
        } else {
            res.render("comments/edit", { product_id: req.params.id, comment: foundComment })
        }
    })
})

router.put("/:comment_id", middlewareObj.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            req.flash("error", err.message) 
            res.redirect("back")
        } else {
            res.redirect("/products/" + req.params.id)
        }
    })
})

router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            req.flash("error", err.message) 
            res.redirect("back")
        } else {
            res.redirect("back")
        }
    })
})

module.exports = router