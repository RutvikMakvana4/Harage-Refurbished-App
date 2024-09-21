import mongoose from "mongoose";
import Address from "../../../model/address";
import commonService from "../../../utils/commonService";
import AddressResource from "./resources/addressResource";
import OneAddressResource from "./resources/oneAddressResource";
import { BadRequestException, NotFoundException } from "../../common/exceptions/errorException";

class addressServices {

	/**
	 * @description: Add Address
	 * @param {*} id 
	 * @param {*} req 
	 * @param {*} res 
	 */
	static async addAddress(data, auth, req, res) {

		const addAddress = await Address.create({
			userId: auth,
			isDefault: true,
			...data
		});

		if (addAddress.isDefault === true) {
			await Address.updateMany({ userId: auth, isDeleted: false, _id: { $ne: addAddress._id } }, { $set: { isDefault: false } });
			await Address.findByIdAndUpdate(addAddress._id, { isDefault: true }, { new: true });
		}
		return { ...new OneAddressResource(addAddress) };
	}



	/**
	 * @description: Edit Address
	 * @param {*} id 
	 * @param {*} req 
	 * @param {*} res 
	 */
	static async editAddress(id, data, req, res) {
		if (mongoose.Types.ObjectId.isValid(id)) {
			const findAddress = await Address.findById({ _id: id });
			if (!findAddress) {
				throw new NotFoundException("This address id not found");
			} else {
				const updateAddress = await Address.findByIdAndUpdate(findAddress.id, {
					...data
				}, { new: true })

				return { ...new OneAddressResource(updateAddress) };
			}
		} else {
			throw new BadRequestException("Please provide correct address id");
		}
	}


	/**
	 * @description: Delete Address
	 * @param {*} id
	 * @param {*} auth  
	 * @param {*} req 
	 * @param {*} res 
	 */
	static async deleteAddress(id, auth, req, res) {
		//    try {
		if (mongoose.Types.ObjectId.isValid(id)) {
			const findAddress = await Address.findById({ _id: id });

			if (findAddress) {
				if (findAddress.isDefault === true) {
					const userAddresses = await Address.find({ userId: auth, isDeleted: false })

					const otherAddress = userAddresses.find(address => address._id.toString() !== id);
					if (otherAddress) {
						await Address.findByIdAndUpdate(otherAddress._id, { isDefault: true }, { new: true });
					}
				}

				// await Address.findByIdAndDelete(findAddress.id);

				await Address.findByIdAndUpdate(findAddress._id, {
					isDeleted: true,
					isDefault: false
				});

			} else {
				throw new NotFoundException("Address not found")
			}
		} else {
			throw new BadRequestException("Please provide correct address id")
		}
		//    } catch (error) {
		//     console.log(error);
		//    }
	}



	/**
	 * @description: List of Address
	 * @param {*} req 
	 * @param {*} res 
	 */
	static async addressList(auth, req, res) {
		const addressList = await Address.find({ userId: auth, isDeleted: false })

		if (!addressList) {
			throw new BadRequestException("Addresses not found");
		} else {
			const addressListResource = new AddressResource(addressList);
			return addressListResource.addresses;
		}
	}


	/**
	 * @description: Set default Address
	 * @param {*} auth 
	 * @param {*} id 
	 * @param {*} req 
	 * @param {*} res 
	 */
	static async setDefaultAddress(auth, id, req, res) {
		// try {
		if (mongoose.Types.ObjectId.isValid(id)) {
			const findAddressId = await Address.findById({ _id: id });

			if (findAddressId) {

				await Address.updateMany({ _id: { $ne: findAddressId._id }, userId: auth }, { $set: { isDefault: false } });

				await Address.findByIdAndUpdate(findAddressId, { isDefault: true }, { new: true });

			} else {
				throw new NotFoundException("This address id is not found");
			}
		} else {
			throw new BadRequestException("Please provide correct id");
		}
		// } catch (err) {
		//     console.log(err)
		// }
	}

	/**
	 * @description : get default address
	 * @param {*} auth 
	 * @param {*} req 
	 * @param {*} res 
	 * @returns 
	 */
	static async getDefaultAddress(auth, req, res) {
		return await Address.findOne({ userId: auth, isDefault: true })
	}

}


export default addressServices;

