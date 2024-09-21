import mongoose from "mongoose";
import Product from "../../../model/product";
import commonService from "../../../utils/commonService";
import OneProductResource from "./resources/OneProductResources";
import ProductListResource from "./resources/listProductsResource";
import { BadRequestException, NotFoundException } from "../../common/exceptions/errorException";
import ProductImages from "../../../model/productImages";
import Category from "../../../model/categories";
import SubCategory from "../../../model/subCategories";
import SubSubCategory from "../../../model/subSubCategories";
import { baseUrl } from "../../common/constants/configConstants";
import Cart from "../../../model/cart";
import { auth } from "firebase-admin";

class productServices {

    /**
     * @description: Add Product
     * @param {*} data 
     * @param {*} auth 
     * @param {*} files 
     * @param {*} req 
     * @param {*} res 
     */
    static async addProducts(data, auth, files, req, res) {

        const imagePaths = files.map(file => `productImages/${file.filename}`);

        for (const key in data) {
            data[key] = data[key] ? data[key] : null
        }

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

        const findImage = await ProductImages.find({ productId: addProduct._id });

        return { ...new OneProductResource(addProduct, findImage) };

    }

    /**
     * @description: get all Products
     * @param {*} req 
     * @param {*} res 
     */
    static async allProducts(query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;

        const productList = await Product.find({ isPurchased: false })

        const productIds = productList.map(product => product._id);

        const findImage = await ProductImages.find({ productId: { $in: productIds } })

        if (!productList) {
            throw new BadRequestException("Products not found");
        } else {
            const totalDocument = await Product.find({ isPurchased: false }).count();

            const meta = {
                total: totalDocument,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(totalDocument / pageLimit),
            }

            const productListResource = new ProductListResource(productList, findImage);

            return { data: productListResource.products, meta };
        }
    }


    /**
    * @description: Find products from subcatgeory and subSubCategroy list
    * @param {*} id 
    * @param {*} req 
    * @param {*} res 
    */
    static async findProducts(query, req, res) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;
        const subCategoryId = query.subCategoryId;
        const subSubCategoryId = query.subSubCategoryId;

        if (subCategoryId) {
            const findProduct = await Product.find({ subCategoryId: subCategoryId });

            if (!findProduct) {
                throw new NotFoundException("This product not found");
            }

            const findImage = await ProductImages.find({ subCategoryId: subCategoryId });
            const totalDocument = await commonService.totalDocuments(Product, { subCategoryId: subCategoryId });
            const meta = {
                total: totalDocument,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(totalDocument / pageLimit),
            }

            const productListResource = new ProductListResource(findProduct, findImage);

            return { data: productListResource.products, meta };
        }

        if (subSubCategoryId) {
            const findProduct = await Product.find({ subSubCategoryId: subSubCategoryId });

            if (!findProduct) {
                throw new NotFoundException("This product not found");
            }

            const findImage = await ProductImages.find({ subSubCategoryId: subSubCategoryId });
            const totalDocument = await commonService.totalDocuments(Product, { subSubCategoryId: subSubCategoryId });
            const meta = {
                total: totalDocument,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(totalDocument / pageLimit),
            }

            const productListResource = new ProductListResource(findProduct, findImage);

            return { data: productListResource.products, meta };
        }
    }



    /**
    * @description: get one product details
    * @param {*} id
    * @param {*} query  
    * @param {*} req 
    * @param {*} res 
    */
    static async productDetails(id, query, auth, req, res) {
        try {
            const categoryId = query.categoryId;
            const subCategoryId = query.subCategoryId;
            const subSubCategoryId = query.subSubCategoryId;

            if (mongoose.Types.ObjectId.isValid(id)) {
                let productDetails = [];
                let productImages;

                const mapAvailableData = (data, field) => {
                    const fieldValue = field.keyName in data ? data[field.keyName] : null;

                    if (fieldValue !== null && typeof fieldValue === 'boolean') {
                        return { name: field.name, keyName: field.keyName, value: fieldValue.toString() };
                    }

                    if (fieldValue !== null && (typeof fieldValue === 'object' || Array.isArray(fieldValue))) {
                        return { name: field.name, keyName: field.keyName, value: JSON.stringify(fieldValue) };
                    }

                    return { name: field.name, keyName: field.keyName, value: fieldValue };
                };

                if (categoryId) {
                    const findCategory = await Category.find({ _id: categoryId });
                    const jsonData = JSON.parse(findCategory[0].buyerData);

                    const availableData = await Product.findById(id);

                    const findImage = await ProductImages.find({ productId: availableData._id });
                    productImages = findImage.map(image => ({
                        _id: image._id,
                        url: baseUrl(image.image)
                    }));

                    productDetails = await Promise.all(jsonData.fields.map(async field => {
                        return mapAvailableData(availableData._doc, field);
                    }));
                }

                if (subCategoryId) {
                    const findSubCategory = await SubCategory.find({ _id: subCategoryId });
                    const jsonData = JSON.parse(findSubCategory[0].buyerData);

                    const availableData = await Product.findById(id);

                    const findImage = await ProductImages.find({ productId: availableData._id });
                    productImages = findImage.map(image => ({
                        _id: image._id,
                        url: baseUrl(image.image)
                    }));

                    productDetails = await Promise.all(jsonData.fields.map(async field => {
                        return mapAvailableData(availableData._doc, field);
                    }));
                }

                if (subSubCategoryId) {
                    const findSubSubCategory = await SubSubCategory.find({ _id: subSubCategoryId });
                    const jsonData = JSON.parse(findSubSubCategory[0].buyerData);

                    const availableData = await Product.findById(id);

                    const findImage = await ProductImages.find({ productId: availableData._id });
                    productImages = findImage.map(image => ({
                        _id: image._id,
                        url: baseUrl(image.image)
                    }));

                    productDetails = await Promise.all(jsonData.fields.map(async field => {
                        return mapAvailableData(availableData._doc, field);
                    }));
                }

                let inCart = false;
                if (req.isAuthenticated) {
                  const findCart = await Cart.findOne({
                    userId: auth,
                    isBuying: false,
                  });
                  if (findCart) {
                    inCart = findCart.addToCart.includes(id);
                  }
                }

                return { data: { productDetails, productImages, inCart } };
            } else {
                throw new BadRequestException("Please provide correct product id");
            }
        } catch (err) {
            console.log(err);
        }
    }


    /**
     * @description : delete Product Images
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async deleteProductImage(id, req, res) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const findImage = await commonService.findById(ProductImages, { _id: id });
            if (findImage) {
                const deleteImage = await commonService.deleteById(ProductImages, findImage.id);
                return;
            } else {
                throw new NotFoundException("Image not found");
            }
        } else {
            throw new BadRequestException("Please provide correct image id");
        }
    }

    /**
     * @description: Delete Product
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteProduct(id, req, res) {
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
    }

    /**
     * @description : Available products filter details
     * @param {*} query 
     * @param {*} req
     * @param {*} res
     */
    static async availableDetails(query, req, res) {
        try {

            const categoryId = query.categoryId
            const subCategoryId = query.subCategoryId
            const subSubCategoryId = query.subSubCategoryId
            const selectedField = query.selectedField

            let baseQuery = {};
            if (categoryId) baseQuery.categoryId = categoryId;
            if (subCategoryId) baseQuery.subCategoryId = subCategoryId;
            if (subSubCategoryId) baseQuery.subSubCategoryId = subSubCategoryId;


            let requiredFields = [];

            let isSelected = false;

            const mapAvailableData = (fieldName, data) => {
                return data.map(value => ({ name: value, isSelected }));
            };

            if (categoryId) {
                const findCategory = await Category.find({ _id: categoryId });
                const jsonData = await JSON.parse(findCategory[0].buyerData);

                requiredFields = await Promise.all(jsonData.fields
                    .filter(field => field.filtered)
                    .map(async field => {
                        const fieldName = field.keyName;
                        const availableData = await Product.find({ ...baseQuery, isSaveDraft: false }).distinct(fieldName);
                        return { name: field.name, keyName: field.keyName, availableData: mapAvailableData(fieldName, availableData) };
                    })
                );
            }


            if (subCategoryId) {
                const findSubCategory = await SubCategory.find({ _id: subCategoryId })

                const jsonData = await JSON.parse(findSubCategory[0].buyerData)
                requiredFields = await Promise.all(jsonData.fields
                    .filter(field => field.filtered)
                    .map(async field => {
                        var fieldName = field.keyName;
                        var availableData = await Product.find({ ...baseQuery, isSaveDraft: false }).distinct(fieldName);
                        return { name: field.name, keyName: field.keyName, availableData: mapAvailableData(fieldName, availableData) };
                    })
                );

            }

            if (subSubCategoryId) {
                const findSubSubCategory = await SubSubCategory.find({ _id: subSubCategoryId })
                const jsonData = await JSON.parse(findSubSubCategory[0].buyerData)

                requiredFields = await Promise.all(jsonData.fields
                    .filter(field => field.filtered)
                    .map(async field => {
                        var fieldName = field.keyName;
                        var availableData = await Product.find({ ...baseQuery, isSaveDraft: false }).distinct(fieldName);
                        return { name: field.name, keyName: field.keyName, availableData: mapAvailableData(fieldName, availableData) };
                    })
                );

            }

            if (selectedField) {
                var availableData = await Product.find(baseQuery).distinct(selectedField)
            }
            return { requiredFields, availableData }

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * @description: Apply Filter
     * @param {*} query 
     * @param {*} auth  
     * @param {*} req 
     * @param {*} res 
     */
    static async applyFilter(query, data, req, res) {
        try {
            const page = parseInt(query.page) - 1 || 0;
            const pageLimit = parseInt(query.limit) || 10;
            const categoryId = query.categoryId;
            const subCategoryId = query.subCategoryId;
            const subSubCategoryId = query.subSubCategoryId;

            let baseQuery = {};
            if (categoryId) baseQuery.categoryId = categoryId;
            if (subCategoryId) baseQuery.subCategoryId = subCategoryId;
            if (subSubCategoryId) baseQuery.subSubCategoryId = subSubCategoryId;

            const search = query.search;

            const searchQuery = search ? {
                $or: [
                    { productName: { $regex: `.*${search}.*`, $options: 'i' } },
                    { brand: { $regex: `.*${search}.*`, $options: 'i' } },
                    { price: { $regex: `.*${search}.*`, $options: 'i' } },
                ],
            } : {};

            const filterLists = [];

            const addFilter = (field, dataArray) => {
                if (dataArray && dataArray.length > 0) {
                    filterLists.push({ [field]: Array.isArray(dataArray) ? dataArray : [dataArray] });
                }
            };

            addFilter('brand', data.brand);
            addFilter('productType', data.productType);
            addFilter('operatingSystem', data.operatingSystem);
            addFilter('screenSize', data.screenSize);
            addFilter('cameraResolution', data.cameraResolution);
            addFilter('storageCapacity', data.storageCapacity);
            addFilter('color', data.color);
            addFilter('availability', data.availability);
            addFilter('features', data.features);
            addFilter('processorType', data.processorType);
            addFilter('batteryLife', data.batteryLife);
            addFilter('condition', data.condition);
            addFilter('model', data.model);
            addFilter('screenType', data.screenType);
            addFilter('resolution', data.resolution);
            addFilter('warrantyStatus', data.warrantyStatus);

            const filterConditions = filterLists.length > 0 ? { $and: filterLists } : {};

            const finalQuery = [
                { ...baseQuery, isSaveDraft: false },
                searchQuery,
                filterConditions
            ];

            const unsortedProducts = await Product.find({ $and: finalQuery })
                .populate('categoryId')
                .populate('subCategoryId')
                .populate('subSubCategoryId')
                .skip(page * pageLimit)
                .limit(pageLimit);

            const sortedProducts = unsortedProducts.sort((a, b) => {
                const priceA = parseFloat(a.price) || 0;
                const priceB = parseFloat(b.price) || 0;

                const createdAtA = new Date(a.createdAt).getTime();
                const createdAtB = new Date(b.createdAt).getTime();

                if (query.sortBy === "1") {
                    return priceA - priceB;
                } else if (query.sortBy === "2") {
                    return priceB - priceA;
                } else if (query.sortBy === "3") {
                    return createdAtB - createdAtA;
                } else if (query.sortBy === "4") {
                    return createdAtA - createdAtB;
                } else {
                    return 0;
                }
            });

            const productIds = sortedProducts.map(product => product._id);

            const findImage = await ProductImages.find({ productId: { $in: productIds } })
            const totalDocument = await Product.find({ $and: finalQuery }).count();

            const meta = {
                total: totalDocument,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(totalDocument / pageLimit)
            };

            return { data: new ProductListResource(sortedProducts, findImage), meta };

        } catch (error) {
            console.log(error)
        }
    }
}

export default productServices;
