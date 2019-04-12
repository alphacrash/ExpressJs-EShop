var mongoose = require("mongoose")
var Product = require("./models/product")
var Comment = require("./models/comment")

var data = [
    { title: "Just lying on the ground", image: "https://cdn.stocksnap.io/img-thumbs/960w/GGQVLCTSWI.jpg", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet ligula venenatis orci consectetur viverra. Suspendisse elementum pulvinar sem eget scelerisque. Aliquam erat volutpat. Integer vulputate elit vitae egestas lacinia. Mauris eleifend rutrum magna non malesuada. Fusce hendrerit at justo et faucibus. Vivamus euismod auctor bibendum. Sed sit amet consequat ipsum, a blandit nibh. Maecenas feugiat vitae erat et vehicula. Donec in dui sed tortor tincidunt posuere. Suspendisse urna mi, dictum ut augue vel, varius lacinia tellus. Integer sed ipsum dui. Sed egestas a elit eget porttitor." },
    { title: "Foot in sand", image: "https://cdn.stocksnap.io/img-thumbs/960w/YRI8K6RLX2.jpg", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet ligula venenatis orci consectetur viverra. Suspendisse elementum pulvinar sem eget scelerisque. Aliquam erat volutpat. Integer vulputate elit vitae egestas lacinia. Mauris eleifend rutrum magna non malesuada. Fusce hendrerit at justo et faucibus. Vivamus euismod auctor bibendum. Sed sit amet consequat ipsum, a blandit nibh. Maecenas feugiat vitae erat et vehicula. Donec in dui sed tortor tincidunt posuere. Suspendisse urna mi, dictum ut augue vel, varius lacinia tellus. Integer sed ipsum dui. Sed egestas a elit eget porttitor." },
    { title: "Make it happen", image: "https://cdn.stocksnap.io/img-thumbs/960w/YEW4VFXSIG.jpg", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet ligula venenatis orci consectetur viverra. Suspendisse elementum pulvinar sem eget scelerisque. Aliquam erat volutpat. Integer vulputate elit vitae egestas lacinia. Mauris eleifend rutrum magna non malesuada. Fusce hendrerit at justo et faucibus. Vivamus euismod auctor bibendum. Sed sit amet consequat ipsum, a blandit nibh. Maecenas feugiat vitae erat et vehicula. Donec in dui sed tortor tincidunt posuere. Suspendisse urna mi, dictum ut augue vel, varius lacinia tellus. Integer sed ipsum dui. Sed egestas a elit eget porttitor." }
]

function seedDB() {
    // Remove all products
    Product.remove({}, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Products cleared.")
            data.forEach(function (seed) {
                Product.create(seed, function (err, newProduct) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Added product")
                        Comment.create(
                            {
                                text: "Nice Product",
                                author: "Hilo"
                            }, function (err, comment) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    newProduct.comments.push(comment)
                                    newProduct.save()
                                    console.log("Created new comment")
                                }
                            }
                        )
                    }
                })
            })
        }
    })
}

module.exports = seedDB