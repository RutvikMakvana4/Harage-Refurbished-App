import moment from "moment";
import AdminLogs from "../../../model/adminLogs";
import UserLogs from "../../../model/userLogs";

class logServices {
    /**
     * @description: Users logs page load
     * @param {*} req 
     * @param {*} res 
     */
    static async userLogsPage(req, res) {
        const assignRoles = req.user ? req.user.assignRoles : [];
        return res.render('webAdmin/logs/userLogs', { assignRoles });
    }


    /**
     * @description: View user logs
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async viewUserLogs(query, req, res) {
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
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: "$user"
                },
                ...(column_name
                    ? [
                        {
                            $sort: {
                                [column_name]: column_sort_order === 'desc' ? -1 : 1,
                                createdAt: -1
                            }
                        }
                    ]
                    : []),
                {
                    $match: {
                        $or: [
                            { "user.fullName": { $regex: search_value, $options: 'i' } },
                            { "user.email": { $regex: search_value, $options: 'i' } },
                            { "user.phone": { $regex: search_value, $options: 'i' } },
                            { "ipAddress": { $regex: search_value, $options: 'i' } },
                            { "action": { $regex: search_value, $options: 'i' } },
                            { "date": { $regex: search_value, $options: 'i' } },
                            { "time": { $regex: search_value, $options: 'i' } },
                        ]
                    }
                },
            ];

            if (matchparam) {
                aggregationPipeline.unshift({
                    $match: matchparam
                });
            }

            const data = await UserLogs.aggregate([...aggregationPipeline, {
                $skip: page
            },
            {
                $limit: limit
            }]);

            const totalData = await UserLogs.aggregate(aggregationPipeline);

            return res.send({
                draw: draw,
                iTotalRecords: totalData.length,
                iTotalDisplayRecords: totalData.length,
                aaData: data,
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description: Admins logs page load
     * @param {*} req 
     * @param {*} res 
     */
    static async adminLogsPage(req, res) {
        const assignRoles = req.user ? req.user.assignRoles : [];
        return res.render('webAdmin/logs/adminLogs', { assignRoles });
    }

    /**
     * @description: View admin logs
     * @param {*} query 
     * @param {*} req 
     * @param {*} res 
     * @returns
     */
    static async viewAdminLogs(query, req, res) {
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
                        from: 'subadmins',
                        localField: 'adminId',
                        foreignField: '_id',
                        as: 'admin'
                    }
                },
                {
                    $unwind: "$admin"
                },
                ...(column_name
                    ? [
                        {
                            $sort: {
                                [column_name]: column_sort_order === 'desc' ? -1 : 1,
                                createdAt: -1
                            }
                        }
                    ]
                    : []),
                {
                    $match: {
                        $or: [
                            { "admin.fullName": { $regex: search_value, $options: 'i' } },
                            { "admin.email": { $regex: search_value, $options: 'i' } },
                            { "role": { $regex: search_value, $options: 'i' } },
                            { "ipAddress": { $regex: search_value, $options: 'i' } },
                            { "action": { $regex: search_value, $options: 'i' } }
                        ]
                    }
                },
            ];

            if (matchparam) {
                aggregationPipeline.unshift({
                    $match: matchparam
                });
            }

            const data = await AdminLogs.aggregate([...aggregationPipeline, {
                $skip: page
            },
            {
                $limit: limit
            }]);

            const totalData = await AdminLogs.aggregate(aggregationPipeline);

            return res.send({
                draw: draw,
                iTotalRecords: totalData.length,
                iTotalDisplayRecords: totalData.length,
                aaData: data,
            });

        } catch (error) {
            console.log(error);
        }
    }

}

export default logServices;