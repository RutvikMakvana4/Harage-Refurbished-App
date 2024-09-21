import commonService from "../../../utils/commonService";
import Category from "../../../model/categories";
import { BadRequestException, NotFoundException } from "../../common/exceptions/errorException";
import SubCategory from "../../../model/subCategories";
import SubSubCategory from "../../../model/subSubCategories";
import mongoose from "mongoose";
import AdminCategoryResource from "./resources/categoryResource";

const ObjectId = mongoose.Types.ObjectId;

class categoryServices {

    /**
      * @description: List of Categories
      * @param {*} req
      * @param {*} res  
      */
    static async allCategories(auth, req, res) {
        const categories = await commonService.findAllRecords(Category, {});
        return categories

    }

    /**
      * @description :  List of Sub Categories
      * @param {*} req
      * @param {*} res
      */

    static async subCategories(auth, id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findId = await commonService.findById(Category, { _id: id })
            const subCategories = await commonService.findAllRecords(SubCategory, { categoryId: findId });
            return subCategories;
        }
    }


    /**
     * @description : List of Sub-Sub-Categories
     * @param {*} req
     * @param {*} res
     */

    static async subSubCategories(auth, id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findId = await commonService.findById(SubCategory, { _id: id })
            const subSubCategories = await commonService.findAllRecords(SubSubCategory, { subCategoryId: findId });
            return subSubCategories;
        }
    }


    /**
     * @description : Sub Categories with sub-subcategory
     * @param {*} auth
     * @param {*} id 
     * @param {*} req
     * @param {*} res
     */

    static async subCategoryList(auth, id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findId = await commonService.findById(Category, { _id: id })

            // try {
            if (findId) {

                const result = await SubCategory.aggregate([
                    {
                        $match: { categoryId: new ObjectId(findId) }
                    },
                    {
                        $lookup: {
                            from: "subsubcategories",
                            localField: "_id",
                            foreignField: "subCategoryId",
                            as: "subSubCategories"
                        }
                    },
                ]);

                // return new SubCategoryResource(result);

            } else {
                throw new NotFoundException("This category id not found");
            }

            // } catch (err) {
            //   console.log(err);
            // }
        } else {
            throw new BadRequestException("Please provide correct category id")
        }
    }

}

export default categoryServices;