import mongoose from "mongoose";
import Product from "../../../model/product";
import ProductImages from "../../../model/productImages";
import commonService from "../../../utils/commonService";
import { NotFoundException, BadRequestException } from "../../common/exceptions/errorException";

class productServices {

    /**
     * @description: add product page load
     * @param {*} req 
     * @param {*} res 
     */
    static async addProductPage(req, res) {
        const assignRoles = req.user ? req.user.assignRoles : [];
        return res.render('webAdmin/product/addProduct', { assignRoles });
    }



    /**
     * @description: add product form submit api
     * @param {*} data 
     * @param {*} files 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addProduct(data, files, req, res) {
        try {
            const imagePaths = files.map(file => `productImages/${file.filename}`);

            for (const key in data) {
                data[key] = data[key] ? data[key] : null
            }

            console.log(data, "after");

            const addProduct = await Product.create({
                ...data
            });

            for (let img of imagePaths) {
                const storeImages = await ProductImages.create({
                    categoryId: addProduct.categoryId,
                    subCategoryId: addProduct.subCategoryId,
                    subSubCategoryId: addProduct.subSubCategoryId,
                    productId: addProduct._id,
                    image: img
                });
            }

            return res.redirect('/webAdmin/product/product-page/all');

        } catch (error) {
            console.log(error, "er0")
        }
    }

    /**
     * @description: product list page load
     * @param {*} req 
     * @param {*} res 
     */
    static async productListPage(req, res) {
        const assignRoles = req.user ? req.user.assignRoles : [];
        return res.render('webAdmin/product/productListing', { assignRoles });
    }

    /**
     * @description: product list
     * @param {*} req 
     * @param {*} res 
     */
    static async productList(query, req, res) {
        const { start, length, search, draw } = query;
        const productId = req.params.id;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        if (productId != "all") {
            const data = await Product.find({ _id: productId })
              .populate("categoryId")
              .populate("subCategoryId")
              .populate("subSubCategoryId");
            return res.send({
              draw: draw,
              iTotalRecords: 1,
              iTotalDisplayRecords: 1,
              aaData: data,
            });
        }
    
        const search_value = search.value;
        const search_query = { $or: [{ "productTitle": { $regex: search_value, $options: 'i' } }, { "brand": { $regex: search_value, $options: 'i' } }, { "modelName": { $regex: search_value, $options: 'i' } }, { "rating": { $regex: search_value, $options: 'i' } }, { "condition": { $regex: search_value, $options: 'i' } }] };
    
        const data = await Product.find(
          search_value ? search_query : { isSaveDraft: false }
        )
          .populate("categoryId")
          .populate("subCategoryId")
          .populate("subSubCategoryId")
          .skip(page)
          .limit(limit)
          .sort({ createdAt: -1 }); 
        
        const count = await Product.find({ isSaveDraft: false }).count()
    
        return res.send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: count,
            aaData: data
        });
    }

    /**
     * @description: Draft product list page load
     * @param {*} req 
     * @param {*} res 
     */
    static async draftProductListPage(req, res) {
        const assignRoles = req.user ? req.user.assignRoles : [];
        return res.render('webAdmin/product/draftProduct', { assignRoles });
    }

    /**
     * @description: Draft product list
     * @param {*} req 
     * @param {*} res 
     */
    static async draftProductList(query, req, res) {
        const { start, length, search, draw } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        const search_value = search.value;
        const search_query = { $or: [{ "productTitle": { $regex: search_value, $options: 'i' } }, { "brand": { $regex: search_value, $options: 'i' } }, { "modelName": { $regex: search_value, $options: 'i' } }, { "rating": { $regex: search_value, $options: 'i' } }, { "condition": { $regex: search_value, $options: 'i' } }] };

        const data = await Product.find(search_value ? search_query : { isSaveDraft: true }).skip(page).limit(limit).sort({ createdAt: -1 });
        const count = await Product.find({ isSaveDraft: true }).count();

        return res.send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: count,
            aaData: data
        });
    }

    /**
     * @description: product list page load
     * @param {*} req 
     * @param {*} res 
     */
    static async viewProductDetailPage(req, res) {
        const assignRoles = req.user ? req.user.assignRoles : [];
        return res.render('webAdmin/product/viewProduct', { assignRoles });
    }


    /**
     * @description: product list
     * @param {*} req 
     * @param {*} res 
     */
    static async viewProductDetail(id, req, res) {
        const findProduct = await Product.findById({ _id: id });

        const findImages = await ProductImages.find({ productId: id })

        return res.json({ 'product': findProduct, 'img': findImages })
    }


    /**
     * @description : delete products
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteProducts(id, req, res) {
        try {
            if (mongoose.Types.ObjectId.isValid(id)) {
                const findProduct = await commonService.findById(Product, { _id: id });

                if (findProduct) {
                    const deleteImage = await ProductImages.deleteMany({ productId: findProduct._id })
                    const deleteItem = await commonService.deleteById(Product, findProduct.id);

                } else {
                    throw new NotFoundException("Product not found");
                }
            } else {
                throw new BadRequestException("Please provide correct product id");
            }
        } catch (err) {
            console.log(err, "op")
        }
    }


    /**
     * @description : delete images
     * @param {*} id
     * @param {*} req
     * @param {*} res      
     */
    static async deleteImage(id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findImage = await ProductImages.findById({ _id: id });
            if (findImage) {
                const deleteImage = await ProductImages.findByIdAndDelete(findImage.id);
                return;
            } else {
                throw new NotFoundException("Image not found");
            }
        } else {
            throw new BadRequestException("Please provide correct image id");
        }
    }

    /**
    * @description: Update Product page
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    static async upadateProductPage(id, req, res) {
        const assignRoles = req.user ? req.user.assignRoles : [];
        const findProduct = await Product.findById({ _id: id }).populate('categoryId').populate('subCategoryId').populate('subSubCategoryId');

        const findImages = await ProductImages.find({ productId: id })
        
        return res.render('webAdmin/product/updateProduct', { 'product': findProduct, "productImage": findImages, assignRoles });
    }

    /**
     * @description: Update product details
     * @param {*} data 
     * @param {*} file 
     * @param {*} req 
     * @param {*} res 
     */
    static async updateProduct(id, data, files, req, res) {
        try {
            const imagePaths = files.map(file => `productImages/${file.filename}`);

            if (mongoose.Types.ObjectId.isValid(id)) {
                const findProduct = await Product.findById({ _id: id })

                const findImages = await ProductImages.find({ productId: findProduct._id });

                if (!findProduct) {
                    throw new NotFoundException("Product not found");
                } else {

                    for (const key in data) {
                        data[key] = data[key] ? data[key] : null
                    }

                    const updateProduct = await Product.findByIdAndUpdate(findProduct.id, {
                        ...data
                    }, { new: true })

                    for (let img of imagePaths) {
                        const storeImages = await ProductImages.create({
                            subCategoryId: findProduct.subCategoryId,
                            subSubCategoryId: findProduct.subSubCategoryId,
                            productId: findProduct._id,
                            image: img
                        });
                    }
                    return updateProduct;
                }
            } else {
                throw new BadRequestException("Please provide correct product id");
            }
        } catch (err) {
            console.log(err, "err0")
            throw new BadRequestException(err)
        }


    }
}

export default productServices;
