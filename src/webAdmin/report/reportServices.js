import ReportProduct from "../../../model/reportProducts";
import { NotFoundException } from "../../common/exceptions/errorException";

class reportServices {
  /**
   * @description: Report list page
   * @param {*} req
   * @param {*} res
   */
  static async reportListPage(req, res) {
    const assignRoles = req.user ? req.user.assignRoles : [];
    return res.render("webAdmin/report/report", {
      assignRoles,
    });
  }

  /**
   * @description : Report list
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async reportList(query, req, res) {
    try {
      const { start, length, search, draw } = query;
      const page = parseInt(start) || 0;
      const limit = parseInt(length) || 10;

      const search_value = search.value;

      const order_data = query.order;
      let column_name = "";
      let column_sort_order = "desc";

      if (order_data) {
        const column_index = parseInt(order_data[0].column);
        column_name = query.columns[column_index].data;
        column_sort_order = order_data[0].dir;
      }

      let matchparam;

      if (query.startDate && query.endDate) {
        const dateString = query.startDate;
        const [day, month, year] = dateString.split("-").map(Number);
        const startDate = new Date(year, month - 1, day, 0, 0, 0);

        const dateString1 = query.endDate;
        const [day1, month1, year1] = dateString1.split("-").map(Number);
        const stringDate = new Date(year1, month1 - 1, day1, 0, 0, 0);
        const endDate = moment(stringDate).add(1, "day");

        matchparam = {
          date: {
            $gte: startDate,
            $lte: new Date(endDate),
          },
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
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "buyorders",
            localField: "orderId",
            foreignField: "_id",
            as: "order",
          },
        },
        {
          $unwind: {
            path: "$order",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "carts",
            localField: "order.cartId",
            foreignField: "_id",
            pipeline: [
              {
                $lookup: {
                  from: "products",
                  localField: "addToCart",
                  foreignField: "_id",
                  as: "addToCart",
                },
              },
            ],
            as: "cart",
          },
        },
        {
          $unwind: {
            path: "$cart",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "buyoneproducts",
            localField: "order.buyProductId",
            foreignField: "_id",
            pipeline: [
              {
                $lookup: {
                  from: "products",
                  localField: "buyOneProduct",
                  foreignField: "_id",
                  as: "buyOneProduct",
                },
              },
            ],
            as: "oneProduct",
          },
        },
        {
          $unwind: {
            path: "$oneProduct",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reportlists",
            localField: "reportReason",
            foreignField: "_id",
            as: "reportReason",
          },
        },
        {
          $unwind: "$reportReason",
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
              { "user.fullName": { $regex: search_value, $options: "i" } },
              { "user.email": { $regex: search_value, $options: "i" } },
              { "user.phone": { $regex: search_value, $options: "i" } },
              //   { option: { $regex: search_value, $options: "i" } },
            ],
          },
        },
      ];

      if (matchparam) {
        aggregationPipeline.unshift({
          $match: matchparam,
        });
      }

      const data = await ReportProduct.aggregate([
        ...aggregationPipeline,
        {
          $skip: page,
        },
        {
          $limit: limit,
        },
      ]);
        
        console.log(data);

      const totalData = await ReportProduct.aggregate(aggregationPipeline);

      return res.send({
        draw: draw,
        iTotalRecords: totalData.length,
        iTotalDisplayRecords: totalData.length,
        aaData: data,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default reportServices;
