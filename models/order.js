var mongoose = require("mongoose")

var orderSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    cart: {
        type: Object,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    delivered: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Order", orderSchema)