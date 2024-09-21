import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Users"
	},
	type: {
		type: String,        // 0 -> Office     1 -> Home      2 -> Apartment
		required: true
	},
	buildingName: {
		type: String,
		// $exists : false,
		default: null
	},
	company: {
		type: String,
		default: null
	},
	floor: {
		type: String,
		default: null
	},
	houseNumber: {
		type: String,
		default: null
	},
	apartmentNo: {
		type: String,
		default: null
	},
	street: {
		type: String,
		required: true,
		default: null
	},
	additionalDirection: {
		type: String,
		default: null
	},
	countryCode: {
		type: String,
		trim: true,
		default: null
	},
	mobileNumber: {
		type: String,
		required: true,
		default: null
	},
	landlineNumber: {
		type: String,
		default: null
	},
	isDefault: {
		type: Boolean,
		default: false
	},
	latitude: {
		type: String,
		trim: true
	},
	longitude: {
		type: String,
		trim: true
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);

export default Address;
