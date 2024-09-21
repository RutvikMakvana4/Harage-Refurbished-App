import mongoose from "mongoose";

const stripeCustomerSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    customerId : {
        type : String,
        trim : true
    },
}, { timestamps: true });

const Customer = mongoose.model('stripecustomer', stripeCustomerSchema);

export default Customer;