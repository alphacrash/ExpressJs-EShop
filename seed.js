var mongoose = require("mongoose")
var author_id = mongoose.Types.ObjectId()
var Product = require("./models/product")
var Order = require("./models/order")

var data = [
    {
        title: "Apple Watch",
        image: "https://www.apple.com/v/home/eb/images/promos/watch-series-4/series_4_spring__c1oad4ap3k6e_medium.jpg",
        content: "More powerful, more colorful.",
        price: "29999",
        author: {
            id: author_id,
            username: "Apple"
        }
    },
    {
        title: "iMac",
        image: "https://www.apple.com/v/home/eb/images/promos/imac/imac__bpep5e0cb4oi_medium.jpg",
        content: "Pretty. Freaking powerful.",
        price: "99900",
        author: {
            id: author_id,
            username: "Apple"
        }
    },
    {
        title: "iPad Mini",
        image: "https://www.apple.com/v/home/eb/images/promos/ipad-mini/ipad_mini_tile__c0jmap32olw2_medium.jpg",
        content: "Mini just got mightier.",
        price: "32900",
        author: {
            id: author_id,
            username: "Apple"
        }
    },
    {
        title: "iPad Air",
        image: "https://www.apple.com/v/home/eb/images/heroes/ipad-air/ipad_air_hero__csmc7ugxq32a_mediumtall.jpg",
        content: "iPad Air. Power isn’t just for the pros.",
        price: "44900",
        author: {
            id: author_id,
            username: "Apple"
        }
    },
    {
        title: "iPhone XS",
        image: "https://www.apple.com/v/home/eb/images/heroes/spring-iphone-xs/iphone_xs__cm637qa5dno2_mediumtall.jpg",
        content: "iPhone XS. Largest Super Retina display. Fastest performance with A12 Bionic. Most secure facial authentication with Face ID. Breakthrough dual cameras with Depth Control. Learn more Buy. ",
        price: "99900",
        author: {
            id: author_id,
            username: "Apple"
        }
    },
    {
        title: "iPhone XR",
        image: "https://www.apple.com/v/home/eb/images/heroes/spring-iphone-xr/iphone_xr__b0z59ak0bqdy_mediumtall.jpg",
        content: "iPhone XR. All-screen design. Longest battery life ever in an iPhone. Fastest performance. Studio-quality photos. Learn more Buy. ",
        price: "59900",
        author: {
            id: author_id,
            username: "Apple"
        }
    }
]



function seedDB() {
    // Remove all products
    Order.remove({}, function(err) {
        if(err) {
            console.log(err)
        } else {
            console.log("Orders cleared.")
        }
    })
    Product.remove({}, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Products cleared.")
            data.forEach(function (seed) {
                Product.create(seed, function (err, newProduct) {
                    if (err) {
                        console.log(err)
                    }
                })
            })
            console.log("Products added.")
        }
    })
}

module.exports = seedDB