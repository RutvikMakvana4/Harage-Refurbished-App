import { NotFoundException } from "../../common/exceptions/errorException";
import Product from "../../../model/product";
import ReturnExchange from "../../../model/returnExchangeRequests";
import { isValidObjectId } from "../../common/helper";

class returnExchangeServices {

    /**
     * @description: Return/Exchange product request list page
     * @param {*} req 
     * @param {*} res 
     */
    static async returnOrExchangeProductListPage(req, res) {
        const assignRoles = req.user ? req.user.assignRoles : [];
        return res.render('webAdmin/returnAndExchange/returnAndExchange', { assignRoles });
    }

    /**
     * @description : Return/Exchange product request list
     * @param {*} query 
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async returnOrExchangeProductList(query, req, res) {
        try {
            const { start, length, search, draw } = query;
            const page = parseInt(start) || 0;
            const limit = parseInt(length) || 10;

            const search_value = search.value;

            const order_data = query.order;
            let column_name = '';
            let column_sort_order = 'desc';

            if (order_data) {
                const column_index = parseInt(order_data[0].column);
                column_name = query.columns[column_index].data;
                column_sort_order = order_data[0].dir;
            }

            let matchparam;

            if (query.startDate && query.endDate) {

                const dateString = query.startDate;
                const [day, month, year] = dateString.split('-').map(Number);
                const startDate = new Date(year, month - 1, day, 0, 0, 0);

                const dateString1 = query.endDate;
                const [day1, month1, year1] = dateString1.split('-').map(Number);
                const stringDate = new Date(year1, month1 - 1, day1, 0, 0, 0);
                const endDate = moment(stringDate).add(1, "day");

                matchparam = {
                    date: {
                        $gte: startDate,
                        $lte: new Date(endDate)
                    }
                };
            }

            const aggregationPipeline = [
              {
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user",
                },
              },
              {
                $unwind: "$user",
              },
              {
                $lookup: {
                  from: "products",
                  localField: "productId",
                  foreignField: "_id",
                  as: "product",
                },
              },
              {
                $lookup: {
                  from: "returnlists",
                  localField: "option",
                  foreignField: "_id",
                  as: "option",
                },
              },
              {
                $unwind: "$option",
              },
              ...(column_name
                ? [
                    {
                      $sort: {
                        [column_name]: column_sort_order === "desc" ? -1 : 1,
                        createdAt: -1,
                      },
                    },
                  ]
                : []),
              {
                $match: {
                  $or: [
                    {
                      "user.fullName": { $regex: search_value, $options: "i" },
                    },
                    { "user.email": { $regex: search_value, $options: "i" } },
                    { "user.phone": { $regex: search_value, $options: "i" } },
                    { option: { $regex: search_value, $options: "i" } },
                  ],
                },
              },
            ];

            if (matchparam) {
                aggregationPipeline.unshift({
                    $match: matchparam
                });
            }

            const data = await ReturnExchange.aggregate([...aggregationPipeline, {
                $skip: page
            },
            {
                $limit: limit
                }]);
            
            console.log(data, "data");

            const totalData = await ReturnExchange.aggregate(aggregationPipeline);

            return res.send({
                draw: draw,
                iTotalRecords: totalData.length,
                iTotalDisplayRecords: totalData.length,
                aaData: data,
            });
        } catch (err) {
            console.log(err)
        } 
    }
}

export default returnExchangeServices;