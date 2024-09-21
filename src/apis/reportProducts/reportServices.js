import mongoose from "mongoose";
import { BadRequestException, NotFoundException } from "../../common/exceptions/errorException";
import Product from "../../../model/product";
import ReportProduct from "../../../model/reportProducts";
import ReportImages from "../../../model/reportImages";
import ReportList from "../../../model/report";
import ReturnList from "../../../model/returnExchange";
import ReturnReportResources from "./resources/returnReportResource";

class reportServices {

    /**
     * @description: Report Product
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     */
    static async reportProduct(auth, data, file, req, res) {

        const { type } = data;

        let reportId;

        if (type == '1') {
            // Order report
            data.userId = auth
            delete data.productId

            const createReport = await ReportProduct.create(data);

            reportId = createReport._id

            return res.send({ message: "Order reported successfully" })
        } else if (type == '2') {
            // Product report
            data.userId = auth
            delete data.orderId

            const createReport = await ReportProduct.create(data);

            reportId = createReport._id

            return res.send({ message: "Item reported successfully" })
        }

        // Images store
        if (file) {
            file.map(async (image) => {
                await ReportImages.create({
                    userId: auth,
                    reportId: reportId,
                    image: `reportImage/${image.filename}`
                });
            });
        }
    }



    /**
     * Return report listing
     * @param {*} query 
     */
    static async reportReturnExchangeList(query) {
        if (query.type === "1") {
            const findReport = await ReportList.find();
            return new ReturnReportResources(findReport);
        } else if (query.type === "2") {
            const findReturn = await ReturnList.find();
            return new ReturnReportResources(findReturn);
        }
    }

}

export default reportServices;